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
import { FlexBox, PaperContainer, TextBlock } from 'components/atoms';
import { LayoutWithSidebar, InfiniteScroll, TitleTab, FlatButton } from 'components/molecules';
import SignInPopup from 'components/SignInPopup';
import QuestionList, { Sidebar } from './QuestionsList';
import './QuestionsList/styles.scss';

const mapStateToProps = state => ({
	posts: discussPostsSelector(state),
	filters: discussFiltersSelector(state),
	hasMore: discussHasMoreSelector(state),
	isFetching: isDiscussFetchingSelector(state),
	isLoggedIn: !!state.userProfile,
});

const mapDispatchToProps = {
	getPosts, emptyPosts, setDiscussFilters, getSidebarQuestions,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Questions extends Component {
	state={
		activeFilter: 8,
		search: null,
		openSigninPopup: false,
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
			this.setState({ search: query.query });
		}

		this.props.setDiscussFilters(query);
		const changed = queryDifference(DEFAULT_DISCUSS_FILTERS, query);
		browserHistory.replace({ ...location, query: changed });
		this.props.getSidebarQuestions();
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the route
		// this.setState({ activeFilter: parseInt(query.orderBy) });

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
		this.setState({ activeFilter: orderBy });
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

	toggleSigninPopup=() => {
		this.setState(({ openSigninPopup }) => ({ openSigninPopup: !openSigninPopup }));
	}

	enterKeyPress=(e) => {
		if (e.keyCode === 13) {
			this.searchQuestion();
		}
	}

	addQuestion=() => {
		const { isLoggedIn } = this.props;
		if (!isLoggedIn) {
			this.toggleSigninPopup();
		} else {
			browserHistory.push('/discuss/new');
		}
	}

	render() {
		const {
			t, posts, hasMore, isFetching, isLoggedIn,
		} = this.props;
		const {
			activeFilter,
			search,
			openSigninPopup,
		} = this.state;
		return (
			<LayoutWithSidebar
				paper={false}
				sidebar={
					<Sidebar />
				}
			>
				<Header
					addQuestion={this.addQuestion}
					searchQuestion={this.searchQuestion}
					onSearchChange={this.onSearchChange}
					enterKeyPress={this.enterKeyPress}
					query={search}
				/>

				<FlexBox align justifyBetween className="discuss-filters">
					<TitleTab
						tabs={this.discussFilters}
						activeTab={activeFilter}
						handleTabChange={this.handleOrderByFilterChange}
					/>
				</FlexBox>
				<InfiniteScroll
					hasMore={hasMore}
					isLoading={isFetching}
					loadMore={this.getPosts}
				>

					<PaperContainer className="question-conatainer">
						{
							!isLoggedIn && (activeFilter === 5 || activeFilter === 6 || activeFilter === 9)
								? (
									<FlexBox column align justifyBetween>
										<TextBlock>Sign in</TextBlock>
										<FlatButton onClick={() => browserHistory.push('signin')}>Sign In</FlatButton>
									</FlexBox>
								)
								: <QuestionList hasMore={hasMore} questions={posts} />
						}
					</PaperContainer>
				</InfiniteScroll>
				<SignInPopup
					url="/discuss"
					open={openSigninPopup}
					onClose={this.toggleSigninPopup}
				/>
			</LayoutWithSidebar>
		);
	}
}

export default Questions;
