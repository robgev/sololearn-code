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
import { PaperContainer, Select, MenuItem, FlexBox } from 'components/atoms';
import { FloatingActionButton, InfiniteScroll, LayoutWithSidebar, TitleTab } from 'components/molecules';

import 'styles/Playground/CodesBase.scss';
import { CodesList, AddCodeButton, Header } from './components';
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
	state = {
		searchValue: '',
	}
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
	handleOrderByFilterChange = (value) => {
		const { location } = this.props;
		browserHistory.push({
			...location,
			query: { ...location.query, ordering: value },
		});
	}
	getCodes = (params) => {
		this.props.getCodes(params)
			.catch(e => showError(e, 'Something went wrong when trying to fetch codes'));
	}
	onSearchChange = (e) => {
		this.setState({ searchValue: e.currentTarget.value });
	}
	searchCodes = () => {
		console.warn('lav ches');
		const { location } = this.props;
		const { searchValue } = this.state;
		browserHistory.push({ ...location, query: { ...location.query, query: searchValue } });
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
					<Header
						value={this.state.searchValue}
						onSearchChange={this.onSearchChange}
						searchCodes={this.searchCodes}
					/>
					<FlexBox justifyBetween>
						<TitleTab
							activeTab={filters.ordering}
							handleTabChange={this.handleOrderByFilterChange}
							tabs={[
								{ value: 'HotToday', text: t('code.filter.hot-today') },
								{ value: 'Trending', text: t('code.filter.trending') },
								{ value: 'YourNetwork', text: t('code.filter.your-network') },
								{ value: 'MostPopular', text: t('code.filter.most-popular') },
								{ value: 'MostRecent', text: t('code.filter.most-recent') },
								{ value: 'MyCodes', text: t('code.filter.my-codes') },
							]}
						/>
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
					</FlexBox>
					<PaperContainer className="playground-codes-container">
						{/* <Container className="playground-codes-toolbar">
							<Container className="playground-menus">

							</Container>
						</Container> */}
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
