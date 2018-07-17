import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import {
	changeDiscussQuery,
	changeDiscussOrdering,
	getQuestionsInternal,
	emptyQuestions,
	changeDiscussHasMore,
} from 'actions/discuss';
import Layout from 'components/Layouts/GeneralLayout';
import Paper from 'material-ui/Paper';
import DropDownMenu from 'material-ui/DropDownMenu';
import MenuItem from 'material-ui/MenuItem';
import Chip from 'material-ui/Chip';
import { QuestionList } from 'components/Shared/Questions';
import AddQuestionButton from 'components/Shared/AddQuestionButton';

const mapStateToProps = state => ({
	order: state.discussFilters.order,
	tag: state.discussFilters.tag,
	hasMore: state.discussFilters.hasMore,
	questions: state.questions,
});

const mapDispatchToProps = {
	changeTag: changeDiscussQuery,
	changeOrder: changeDiscussOrdering,
	getQuestions: getQuestionsInternal,
	emptyQuestions,
	changeHasMore: changeDiscussHasMore,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Questions extends Component {
	constructor() {
		super();
		document.title = 'Sololearn | Discuss';
	}
	componentWillMount() {
		this.matchQueryWithProps();
	}
	shouldComponentUpdate() {
		return this.props.location.query.order != null;
	}
	componentWillUpdate(nextProps) {
		const { query: currQuery } = this.props.location;
		const { query: nextQuery } = nextProps.location;
		const orderChanged = currQuery.order !== nextQuery.order;
		const tagChanged = currQuery.tag !== nextQuery.tag;
		if (orderChanged) {
			this.props.changeOrder(parseInt(nextQuery.order, 10));
		}
		if (tagChanged) {
			this.props.changeTag(nextQuery.tag);
		}
		if (orderChanged || tagChanged) {
			this.props.emptyQuestions();
			this.props.changeHasMore(true);
		}
	}
	matchQueryWithProps = () => {
		const { location } = this.props;
		const { tag, order } = location.query;
		const query = {};
		if (tag != null) {
			this.props.changeTag(tag);
		} else if (this.props.tag !== '') {
			query.tag = this.props.tag;
		}
		if (order != null) {
			this.props.changeOrder(parseInt(order, 10));
		} else {
			query.order = this.props.order;
		}
		browserHistory.replace({ ...location, query: { ...location.query, ...query } });
	}
	loadMore = () => {
		const {
			questions, tag, order,
		} = this.props;
		this.props.getQuestions({
			index: questions !== null ? questions.length : 0, query: tag, orderBy: order,
		});
	}
	handleFilterChange = (_, __, order) => {
		const { location } = this.props;
		browserHistory.push({ ...location, query: { ...location.query, order } });
	}
	removeTag = () => {
		const { location } = this.props;
		const { tag, ...query } = location.query; // remove tag from query
		browserHistory.push({ ...location, query });
	}
	render() {
		const {
			questions, t, order, hasMore, tag,
		} = this.props;
		return (
			<Layout>
				<Paper style={{ marginBottom: 10, display: 'flex', justifyContent: 'space-between' }}>
					<div style={{ display: 'flex', alignItems: 'center', marginLeft: 15 }}>
						{tag !== '' &&
							<Chip onRequestDelete={this.removeTag}>{tag}</Chip>}
					</div>
					<DropDownMenu
						value={order}
						onChange={this.handleFilterChange}
					>
						<MenuItem value={8} primaryText={t('discuss.filter.trending')} />
						<MenuItem value={1} primaryText={t('discuss.filter.most-recent')} />
						<MenuItem value={2} primaryText={t('discuss.filter.most-popular')} />
						<MenuItem value={3} primaryText="Most Answered" />
						<MenuItem value={4} primaryText={t('discuss.filter.unanswered')} />
						<MenuItem value={5} primaryText={t('discuss.filter.my-questions')} />
						<MenuItem value={6} primaryText={t('discuss.filter.my-answers')} />
					</DropDownMenu>
				</Paper>
				<div style={{ position: 'relative' }}>
					<QuestionList questions={questions} hasMore={hasMore} loadMore={this.loadMore} />
					<AddQuestionButton />
				</div>
			</Layout>
		);
	}
}

export default Questions;
