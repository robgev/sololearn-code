import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import Header from './Header';
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
import { FlexBox, Select, MenuItem, Title } from 'components/atoms';
import { LayoutWithSidebar, InfiniteScroll, TitleTab } from 'components/molecules';
import QuestionList, { Sidebar } from './QuestionsList';
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
	state={
		avtiveFilter: 8,
		search: null,
	}

	constructor(props) {
		super(props);
		this.discussFilters = [
			{ value: 8, text: this.props.t('discuss.filter.trending') },
			{ value: 9, text: this.props.t('discuss.filter.your-network') },
			{ value: 1, text: this.props.t('discuss.filter.most-recent') },
			{ value: 2, text: this.props.t('discuss.filter.most-popular') },
			{ value: 4, text: this.props.t('discuss.filter.unanswered') },
			{ value: 5, text: this.props.t('discuss.filter.my-questions') },
			{ value: 6, text: this.props.t('discuss.filter.my-answers') },
		];
	}

	componentDidMount() {
		document.title = 'Sololearn | Discuss';
		const { location, filters } = this.props;
		// if searching (location.query.query), default filer has to be selected
		const query = {
			...(location.query.query != null ? DEFAULT_DISCUSS_FILTERS : filters),
			...location.query,
		};
		if (query.query !== '') {
			console.log(query.query);
			this.setState({ search: query.query });
		}
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
	handleOrderByFilterChange = (orderBy) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, orderBy } });
		this.setState({ avtiveFilter: orderBy });
	}
	removeQuery = () => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, query: '' } });
	}

	searchQuestion=() => {
		const { location } = this.props;
		const { search } = this.state;
		browserHistory.push({ ...location, query: { ...location.query, query: search } });
	}

	onSearchChange=(e) => {
		this.setState({ search: e.target.value });
	}

	enterKeyPress=(e) => {
		if (e.keyCode === 13) {
			this.searchQuestion();
		}
	}

	render() {
		const {
			t, posts, hasMore, isFetching,
		} = this.props;
		const {
			avtiveFilter,
			search,
		} = this.state;
		return (
			<LayoutWithSidebar
				paper={false}
				sidebar={
					<Sidebar />
				}
			>
				<Header
					searchQuestion={this.searchQuestion}
					onSearchChange={this.onSearchChange}
					enterKeyPress={this.enterKeyPress}
					query={search}
				/>

				<FlexBox align justifyBetween className="discuss-filters">
					<TitleTab
						tabs={this.discussFilters}
						activeTab={avtiveFilter}
						handleTabChange={this.handleOrderByFilterChange}
					/>
				</FlexBox>
				<InfiniteScroll
					hasMore={hasMore}
					isLoading={isFetching}
					loadMore={this.getPosts}
				>

					<QuestionList hasMore={hasMore} questions={posts} />
				</InfiniteScroll>
			</LayoutWithSidebar>
		);
	}
}

export default Questions;
