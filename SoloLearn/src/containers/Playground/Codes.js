import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import {
	getCodes, emptyCodes, setCodesFilters, getSidebarCodes,
} from 'actions/playground';
import {
	DEFAULT_CODES_FILTERS,
	codesSelector,
	codesFiltersSelector,
	codesHasMoreSelector,
} from 'reducers/codes.reducer';
import { showError, queryDifference, isObjectEqual } from 'utils';

import { Add } from 'components/icons';
import { PaperContainer, Heading, Container, Select, MenuItem } from 'components/atoms';
import { FloatingActionButton, InfiniteScroll, LayoutWithSidebar } from 'components/molecules';

import 'styles/Playground/CodesBase.scss';
import { CodesList, AddCodeButton } from './components';
import PlaygroundSidebar from './PlaygroundSidebar';

const mapStateToProps = state => ({
	codes: codesSelector(state),
	filters: codesFiltersSelector(state),
	hasMore: codesHasMoreSelector(state),
});

const mapDispatchToProps = {
	getCodes, emptyCodes, setCodesFilters, getSidebarCodes,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class Codes extends Component {
	componentDidMount() {
		document.title = 'Sololearn | Code Playground';
		const { location, filters } = this.props;
		const query = { ...filters, ...location.query };
		this.props.setCodesFilters(query);
		const changed = queryDifference(DEFAULT_CODES_FILTERS, query);
		browserHistory.replace({ ...location, query: changed });
		this.props.getSidebarCodes();
		this.getCodes({ forceRefresh: true });
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the route
		const { location } = nextProps;
		if (!isObjectEqual(location.query, this.props.location.query)) {
			const changed = queryDifference(DEFAULT_CODES_FILTERS, location.query);
			browserHistory.replace({ ...location, query: changed });
			this.props.setCodesFilters({
				...DEFAULT_CODES_FILTERS,
				...location.query,
			});
		}
	}
	componentWillUnmount() {
		this.props.setCodesFilters({ ...this.props.filters, query: '' });
	}
	handleLanguageFilterChange = (event) => {
		const { location } = this.props;
		const language = event.target.value === 'all' ? '' : event.target.value;
		browserHistory.push({
			...location,
			query: { ...location.query, language },
		});
	}
	handleOrderByFilterChange = (event) => {
		const { location } = this.props;
		browserHistory.push({
			...location,
			query: { ...location.query, ordering: event.target.value },
		});
	}
	getCodes = (params) => {
		this.props.getCodes(params)
			.catch(e => showError(e, 'Something went wrong when trying to fetch codes'));
	}
	render() {
		const {
			codes, filters, hasMore, t,
		} = this.props;
		return (
			<LayoutWithSidebar sidebar={<PlaygroundSidebar />}>
				<InfiniteScroll
					hasMore={hasMore}
					loadMore={this.getCodes}
				>
					<PaperContainer className="playground-codes-container">
						<Container className="playground-codes-toolbar">
							<Heading>{t('code_playground.title')}</Heading>
							<Container className="playground-menus">
								<Select
									value={filters.language || 'all'}
									className="playground-menu-spaced"
									onChange={this.handleLanguageFilterChange}
								>
									<MenuItem value="all">{t('code.language-filter.all')}</MenuItem>
									<MenuItem value="web">Web</MenuItem>
									<MenuItem value="cpp">C++</MenuItem>
									<MenuItem value="c">C</MenuItem>
									<MenuItem value="cs">C#</MenuItem>
									<MenuItem value="java">Java</MenuItem>
									<MenuItem value="kt">Kotlin</MenuItem>
									<MenuItem value="swift">Swift</MenuItem>
									<MenuItem value="py">Python</MenuItem>
									<MenuItem value="rb">Ruby</MenuItem>
									<MenuItem value="php">PHP</MenuItem>
								</Select>
								<Select
									value={filters.ordering}
									onChange={this.handleOrderByFilterChange}
								>
									<MenuItem value="HotToday">{t('code.filter.hot-today')}</MenuItem>
									<MenuItem value="Trending">{t('code.filter.trending')}</MenuItem>
									<MenuItem value="YourNetwork">{t('code.filter.your-network')}</MenuItem>
									<MenuItem value="MostPopular">{t('code.filter.most-popular')}</MenuItem>
									<MenuItem value="MostRecent">{t('code.filter.most-recent')}</MenuItem>
									<MenuItem value="MyCodes">{t('code.filter.my-codes')}</MenuItem>
								</Select>
							</Container>
						</Container>
						<CodesList
							codes={codes}
							hasMore={hasMore}
						/>
						<AddCodeButton>
							{({ togglePopup }) => (
								<FloatingActionButton color="secondary" alignment="right" onClick={togglePopup}>
									<Add />
								</FloatingActionButton>
							)}
						</AddCodeButton>
					</PaperContainer>
				</InfiniteScroll>
			</LayoutWithSidebar>
		);
	}
}

export default Codes;
