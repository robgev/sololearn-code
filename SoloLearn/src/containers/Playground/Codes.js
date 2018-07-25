import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { DropDownMenu, MenuItem } from 'material-ui';
import {
	getCodes, emptyCodes, removeCode,
	changeCodesLanguageFilter, changeCodesOrderByFilter,
} from 'actions/playground';
import {
	codesSelector, codesFiltersSelector, codesHasMoreSelector,
} from 'reducers/codes.reducer';

import Layout from 'components/Layouts/GeneralLayout';
import CodesList from './CodesList';

const mapStateToProps = state => ({
	codes: codesSelector(state),
	filters: codesFiltersSelector(state),
	hasMore: codesHasMoreSelector(state),
});

const mapDispatchToProps = {
	getCodes, emptyCodes, removeCode, changeCodesLanguageFilter, changeCodesOrderByFilter,
};

@translate()
@connect(mapStateToProps, mapDispatchToProps)
class Codes extends Component {
	componentDidMount() {
		const { location, filters } = this.props;
		const newQuery = { ...location.query };
		if (location.query.orderBy) {
			this.props.changeCodesOrderByFilter(parseInt(location.query.orderBy, 10));
		} else {
			newQuery.orderBy = filters.orderBy;
		}
		if (location.query.language) {
			this.props.changeCodesLanguageFilter(location.query.language);
		} else {
			newQuery.language = filters.language;
		}
		browserHistory.replace({ ...location, query: { ...location.query, ...newQuery } });
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the redux store
		if (this.props.filters !== nextProps.filters) {
			const { location } = this.props;
			browserHistory.replace({ ...location, query: { ...location.query, ...nextProps.filters } });
			this.props.emptyCodes();
		}
	}
	handleLanguageFilterChange = (_, __, val) => {
		this.props.changeCodesLanguageFilter(val);
	}
	handleOrderByFilterChange = (_, __, val) => {
		this.props.changeCodesOrderByFilter(val);
	}
	render() {
		const {
			codes, filters, hasMore, t,
		} = this.props;
		return (
			<Layout>
				<CodesList
					header={
						<div>
							<DropDownMenu
								value={filters.language}
								autoWidth={false}
								onChange={this.handleLanguageFilterChange}
							>
								<MenuItem value="" primaryText={t('code.language-filter.all')} />
								<MenuItem value="cpp" primaryText="C++" />
								<MenuItem value="cs" primaryText="C#" />
								<MenuItem value="java" primaryText="Java" />
								<MenuItem value="py" primaryText="Python" />
								<MenuItem value="rb" primaryText="Ruby" />
								<MenuItem value="php" primaryText="PHP" />
								<MenuItem value="web" primaryText="Web" />
							</DropDownMenu>
							<DropDownMenu
								value={filters.orderBy}
								autoWidth={false}
								onChange={this.handleOrderByFilterChange}
							>
								<MenuItem value={4} primaryText={t('code.filter.trending')} />
								<MenuItem value={2} primaryText={t('code.filter.most-popular')} />
								<MenuItem value={1} primaryText={t('code.filter.most-recent')} />
								<MenuItem value={3} primaryText={t('code.filter.my-codes')} />
							</DropDownMenu>
						</div>
					}
					codes={codes}
					hasMore={hasMore}
					loadMore={this.props.getCodes}
				/>
			</Layout>
		);
	}
}

export default Codes;
