import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { showError, queryDifference, isObjectEqual } from 'utils';
import {
	getPosts, emptyPosts, setDiscussFilters, getSidebarQuestions,
} from 'actions/discuss';
import {
	DEFAULT_DISCUSS_FILTERS,
	discussPostsSelector,
	discussFiltersSelector,
	discussHasMoreSelector,
} from 'reducers/discuss.reducer';
import Layout from 'components/Layouts/GeneralLayout';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import { QuestionList } from 'components/Questions';
import AddQuestionButton from 'components/AddQuestionButton';

import DiscussSidebar from './DiscussSidebar';

const mapStateToProps = state => ({
	posts: discussPostsSelector(state),
	filters: discussFiltersSelector(state),
	hasMore: discussHasMoreSelector(state),
});

const mapDispatchToProps = {
	getPosts, emptyPosts, setDiscussFilters, getSidebarQuestions,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Questions extends Component {
	componentDidMount() {
		document.title = 'Sololearn | Discuss';
		const { location, filters } = this.props;
		const query = { ...filters, ...location.query };
		this.props.setDiscussFilters(query);
		const changed = queryDifference(DEFAULT_DISCUSS_FILTERS, query);
		browserHistory.replace({ ...location, query: changed });
		this.props.getSidebarQuestions();
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the route
		const { location } = nextProps;
		if (!isObjectEqual(location.query, this.props.location.query)) {
			const changed = queryDifference(DEFAULT_DISCUSS_FILTERS, location.query);
			browserHistory.replace({ ...location, query: changed });
			this.props.setDiscussFilters(location.query);
		}
	}
	componentWillUnmount() {
		this.props.setDiscussFilters({ query: '' });
	}
	getPosts = () => {
		this.props.getPosts()
			.catch((e) => {
				showError(e, 'Something went wrong when trying to fetch questions');
			});
	}
	handleOrderByFilterChange = (_, __, orderBy) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, orderBy } });
	}
	removeQuery = () => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, query: '' } });
	}
	render() {
		const {
			t, posts, filters, hasMore,
		} = this.props;
		return (
			<Layout
				sidebarContent={
					<DiscussSidebar />
				}
			>
				<div style={{ position: 'relative' }}>
					<QuestionList
						header={
							<div style={{
								marginBottom: 10, display: 'flex', justifyContent: 'space-between',
							}}
							>
								<p className="page-title">{t('discuss.title')}</p>
								<DropDownMenu
									style={{ height: 20, zIndex: 1 }}
									value={filters.orderBy}
									className="mini-drop-down"
									iconStyle={{ height: 5, padding: 0 }}
									onChange={this.handleOrderByFilterChange}
									labelStyle={{ height: 20, lineHeight: '20px' }}
								>
									<MenuItem value={8} primaryText={t('discuss.filter.trending')} />
									<MenuItem value={9} primaryText={t('discuss.filter.your-network')} />
									<MenuItem value={1} primaryText={t('discuss.filter.most-recent')} />
									<MenuItem value={2} primaryText={t('discuss.filter.most-popular')} />
									<MenuItem value={4} primaryText={t('discuss.filter.unanswered')} />
									<MenuItem value={5} primaryText={t('discuss.filter.my-questions')} />
									<MenuItem value={6} primaryText={t('discuss.filter.my-answers')} />
								</DropDownMenu>
							</div>
						}
						questions={posts}
						hasMore={hasMore}
						loadMore={this.getPosts}
					/>
					<AddQuestionButton />
				</div>
			</Layout>
		);
	}
}

export default Questions;
