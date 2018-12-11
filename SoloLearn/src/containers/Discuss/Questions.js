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
	isDiscussFetchingSelector,
} from 'reducers/discuss.reducer';
import { Heading, PaperContainer, FlexBox, Select, MenuItem } from 'components/atoms';
import { LayoutWithSidebar, InfiniteScroll } from 'components/molecules';
import QuestionList, { Sidebar, AddQuestionButton } from './QuestionsList';
import './QuestionsList/styles.scss';

const mapStateToProps = state => ({
	posts: discussPostsSelector(state),
	filters: discussFiltersSelector(state),
	hasMore: discussHasMoreSelector(state),
	isFetching: isDiscussFetchingSelector(state),
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
		// if searching (location.query.query), default filer has to be selected
		const query = {
			...(location.query.query != null ? DEFAULT_DISCUSS_FILTERS : filters),
			...location.query,
		};
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
			this.props.setDiscussFilters({ ...DEFAULT_DISCUSS_FILTERS, ...location.query });
		}
	}
	componentWillUnmount() {
		this.props.setDiscussFilters({ ...this.props.filters, query: '' });
	}
	getPosts = () => {
		this.props.getPosts()
			.catch((e) => {
				showError(e, 'Something went wrong when trying to fetch questions');
			});
	}
	handleOrderByFilterChange = (e) => {
		const orderBy = e.target.value;
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, orderBy } });
	}
	removeQuery = () => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, query: '' } });
	}
	render() {
		const {
			t, posts, filters, hasMore, isFetching,
		} = this.props;
		return (
			<LayoutWithSidebar
				sidebar={
					<Sidebar />
				}
			>
				<InfiniteScroll
					hasMore={hasMore}
					isLoading={isFetching}
					loadMore={this.getPosts}
				>
					<PaperContainer className="discuss_questions-list">
						<FlexBox className="toolbar">
							<Heading>{t('discuss.title')}</Heading>
							<Select
								className="select"
								value={filters.orderBy}
								onChange={this.handleOrderByFilterChange}
							>
								<MenuItem value={8}>{t('discuss.filter.trending')}</MenuItem>
								<MenuItem value={9}>{t('discuss.filter.your-network')}</MenuItem>
								<MenuItem value={1}>{t('discuss.filter.most-recent')}</MenuItem>
								<MenuItem value={2}>{t('discuss.filter.most-popular')}</MenuItem>
								<MenuItem value={4}>{t('discuss.filter.unanswered')}</MenuItem>
								<MenuItem value={5}>{t('discuss.filter.my-questions')}</MenuItem>
								<MenuItem value={6}>{t('discuss.filter.my-answers')}</MenuItem>
							</Select>
						</FlexBox>
						<QuestionList hasMore={hasMore} questions={posts} />
						<AddQuestionButton />
					</PaperContainer>
				</InfiniteScroll>
			</LayoutWithSidebar>
		);
	}
}

export default Questions;
