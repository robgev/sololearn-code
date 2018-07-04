// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import Radium from 'radium';

// Material UI components
import { DropDownMenu, MenuItem, Paper } from 'material-ui';

// Redux modules
import { connect } from 'react-redux';
import { isLoaded } from 'reducers';
import { changeDiscussQuery, changeDiscussOrdering } from 'actions/discuss';

// Additional components
import Layout from 'components/Layouts/GeneralLayout';
import AddQuestionButton from 'components/Shared/AddQuestionButton';
import Questions from './Questions';

// i18n

import { QuestionsBaseStyles as styles } from './styles';

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'discuss'),
	questions: state.questions,
	query: state.discussFilters.discussQuery,
	ordering: state.discussFilters.discussOrdering,
});

const mapDispatchToProps = { changeDiscussOrdering, changeDiscussQuery };

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
@translate()
@Radium
class QuestionsBase extends Component {
	state = {
		suggestions: [],
	}
	componentWillMount() {
		if (this.props.params.query) this.props.changeDiscussQuery(this.props.params.query);
		else if (this.props.query !== '' &&
			this.props.params.query !== this.props.query) {
			browserHistory.replace(`/discuss/filter/${this.props.query}`);
		}
	}
	componentWillReceiveProps(nextProps) {
		if (nextProps.params.query !== this.props.params.query) {
			this.props.changeDiscussQuery(nextProps.params.query);
		}
	}
	// Get search suggestions
	// handleUpdateInput = async (query) => {
	// 	const { tags } = await Service.request('Discussion/getTags', { query });
	// 	this.setState({ suggestions: tags });
	// }
	// Clear search input
	clearSearchInput = () => {
		browserHistory.push('/discuss');
	}
	// Change discuss oredering
	handleFilterChange = (e, index, value) => {
		this.props.changeDiscussOrdering(value);
	}
	// handleEnter = (e) => {
	// 	if (e.key === 'Enter') {
	// 		browserHistory.push(`/discuss/filter/${e.target.value}`);
	// 	}
	// }
	render() {
		const { t } = this.props;
		return (
			<Layout>
				<Paper style={{ position: 'relative' }}>
					<div className="toolbar" style={styles.toolbar}>
						<DropDownMenu
							style={styles.discussFilter}
							value={this.props.ordering}
							onChange={this.handleFilterChange}
							autoWidth={false}
						>
							<MenuItem style={styles.discussFilterItem} value={8} primaryText={t('discuss.filter.trending')} />
							<MenuItem style={styles.discussFilterItem} value={1} primaryText={t('discuss.filter.most-recent')} />
							<MenuItem style={styles.discussFilterItem} value={2} primaryText={t('discuss.filter.most-popular')} />
							<MenuItem style={styles.discussFilterItem} value={3} primaryText="Most Answered" />
							<MenuItem style={styles.discussFilterItem} value={4} primaryText={t('discuss.filter.unanswered')} />
							<MenuItem style={styles.discussFilterItem} value={5} primaryText={t('discuss.filter.my-questions')} />
							<MenuItem style={styles.discussFilterItem} value={6} primaryText={t('discuss.filter.my-answers')} />
						</DropDownMenu>
					</div>
					<Questions
						t={t}
						questions={this.props.questions}
						isLoaded={this.props.isLoaded}
						ordering={this.props.ordering}
						query={this.props.params.query}
						isUserProfile={false}
						ref={(questions) => { this._questions = questions; }}
					/>
					<AddQuestionButton />
				</Paper>
			</Layout>
		);
	}
}

export default QuestionsBase;
