import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
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

import AddCodeButton from 'components/AddCodeButton';
import FloatingButton from 'components/AddCodeButton/FloatingButton';
import Layout from 'components/Layouts/GeneralLayout';

import 'styles/Playground/CodesBase.scss';
import CodesList from './CodesList';
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
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the route
		const { location } = nextProps;
		if (!isObjectEqual(location.query, this.props.location.query)) {
			const changed = queryDifference(DEFAULT_CODES_FILTERS, location.query);
			browserHistory.replace({ ...location, query: changed });
			this.props.setCodesFilters(location.query);
		}
	}
	handleLanguageFilterChange = (_, __, language) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, language } });
	}
	handleOrderByFilterChange = (_, __, orderBy) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, orderBy } });
	}
	getCodes = () => {
		this.props.getCodes()
			.catch(e => showError(e, 'Something went wrong when trying to fetch codes'));
	}
	render() {
		const {
			codes, filters, hasMore, t,
		} = this.props;
		return (
			<Layout
				sidebarContent={<PlaygroundSidebar />}
			>
				<div className="playground-codes-container">
					<CodesList
						header={
							<div className="playground-codes-toolbar">
								<p className="page-title">{t('code_playground.title')}</p>
								<div className="playground-menus">
									<DropDownMenu
										autoWidth={false}
										style={{ height: 20 }}
										value={filters.language}
										className="mini-drop-down"
										iconStyle={{ height: 5, padding: 0 }}
										labelStyle={{ height: 20, lineHeight: '20px' }}
										onChange={this.handleLanguageFilterChange}
									>
										<MenuItem value="" primaryText={t('code.language-filter.all')} />
										<MenuItem value="web" primaryText="Web" />
										<MenuItem value="cpp" primaryText="C++" />
										<MenuItem value="c" primaryText="C" />
										<MenuItem value="cs" primaryText="C#" />
										<MenuItem value="java" primaryText="Java" />
										<MenuItem value="kt" primaryText="Kotlin" />
										<MenuItem value="swift" primaryText="Swift" />
										<MenuItem value="py" primaryText="Python" />
										<MenuItem value="rb" primaryText="Ruby" />
										<MenuItem value="php" primaryText="PHP" />
									</DropDownMenu>
									<DropDownMenu
										style={{ height: 20, zIndex: 1 }}
										iconStyle={{ height: 5, padding: 0 }}
										labelStyle={{ height: 20, lineHeight: '20px' }}
										className="mini-drop-down"
										value={filters.orderBy}
										autoWidth={false}
										onChange={this.handleOrderByFilterChange}
									>
										<MenuItem value={6} primaryText={t('code.filter.hot-today')} />
										<MenuItem value={4} primaryText={t('code.filter.trending')} />
										<MenuItem value={5} primaryText={t('code.filter.your-network')} />
										<MenuItem value={2} primaryText={t('code.filter.most-popular')} />
										<MenuItem value={1} primaryText={t('code.filter.most-recent')} />
										<MenuItem value={3} primaryText={t('code.filter.my-codes')} />
									</DropDownMenu>
								</div>
							</div>
						}
						codes={codes}
						hasMore={hasMore}
						loadMore={this.getCodes}
					/>
					<AddCodeButton>
						{({ togglePopup }) => <FloatingButton onClick={togglePopup} />}
					</AddCodeButton>
				</div>
			</Layout>
		);
	}
}

export default Codes;
