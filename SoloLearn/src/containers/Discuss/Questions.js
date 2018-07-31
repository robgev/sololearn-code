import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { toast } from 'react-toastify';
import { showError } from 'utils';
import {
	getPosts, emptyPosts,
	changeDiscussQueryFilter, changeDiscussOrderByFilter,
} from 'actions/discuss';
import {
	discussPostsSelector,
	discussFiltersSelector,
	discussHasMoreSelector,
} from 'reducers/discuss.reducer';
import Layout from 'components/Layouts/GeneralLayout';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import { QuestionList } from 'components/Questions';
import AddQuestionButton from 'components/AddQuestionButton';

const mapStateToProps = state => ({
	posts: discussPostsSelector(state),
	filters: discussFiltersSelector(state),
	hasMore: discussHasMoreSelector(state),
});

const mapDispatchToProps = {
	getPosts, emptyPosts, changeDiscussQueryFilter, changeDiscussOrderByFilter,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Questions extends Component {
	componentDidMount() {
		document.title = 'Sololearn | Discuss';
		const { location, filters } = this.props;
		const newQuery = { ...location.query };
		if (location.query.orderBy) {
			const numOrderBy = parseInt(location.query.orderBy, 10);
			if (numOrderBy !== filters.orderBy) {
				this.props.changeDiscussOrderByFilter(numOrderBy);
			}
		} else {
			newQuery.orderBy = filters.orderBy;
		}
		if (location.query.query) {
			if (location.query.query !== filters.query) {
				this.props.changeDiscussQueryFilter(location.query.query);
			}
		} else {
			newQuery.query = filters.query;
		}
		browserHistory.replace({ ...location, query: { ...location.query, ...newQuery } });
	}
	componentWillUpdate(nextProps) {
		// Source of truth is the redux store
		if (this.props.filters !== nextProps.filters) {
			const { location } = this.props;
			browserHistory.replace({ ...location, query: { ...location.query, ...nextProps.filters } });
		}
	}
	getPosts = () => {
		try {
			this.props.getPosts();
		} catch (e) {
			if (e.data) {
				showError(e.data);
			} else {
				toast.error(`❌Something went wrong when trying to fetch questions: ${e.message}`);
			}
		}
	}
	handleOrderByFilterChange = (_, __, orderBy) => {
		this.props.changeDiscussOrderByFilter(orderBy);
	}
	removeQuery = () => {
		this.props.changeDiscussQueryFilter('');
	}
	render() {
		const {
			t, posts, filters, hasMore,
		} = this.props;
		return (
			<Layout>
				<div style={{ position: 'relative' }}>
					<QuestionList
						header={
							<div style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
								<div style={{ display: 'flex', alignItems: 'center', marginLeft: 15 }}>
									{filters.query !== '' &&
										<Chip onRequestDelete={this.removeQuery}>{filters.query}</Chip>}
								</div>
								<DropDownMenu
									value={filters.orderBy}
									onChange={this.handleOrderByFilterChange}
								>
									<MenuItem value={8} primaryText={t('discuss.filter.trending')} />
									<MenuItem value={1} primaryText={t('discuss.filter.most-recent')} />
									<MenuItem value={2} primaryText={t('discuss.filter.most-popular')} />
									<MenuItem value={3} primaryText="Most Answered" />
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
