// React modules
import React, { Component } from 'react';
import { Link, browserHistory } from 'react-router';
import Radium from 'radium';

// Material UI components
import { AutoComplete, DropDownMenu, MenuItem, FloatingActionButton } from 'material-ui';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import { grey700 } from 'material-ui/styles/colors';
import ContentAdd from 'material-ui/svg-icons/content/add';

// Redux modules
import { connect } from 'react-redux';
import { isLoaded } from 'reducers';
import { changeDiscussQuery, changeDiscussOrdering } from 'actions/discuss';

// Service
import Service from 'api/service';

// Additional components
import Questions from './Questions';

import { QuestionsBaseStyles as styles } from './styles';

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'discuss'),
	questions: state.questions,
	query: state.discussFilters.discussQuery,
	ordering: state.discussFilters.discussOrdering,
});

const mapDispatchToProps = { changeDiscussOrdering, changeDiscussQuery };

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
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
	handleUpdateInput = async (query) => {
		const { tags } = await Service.request('Discussion/getTags', { query });
		this.setState({ suggestions: tags });
	}
	// Clear search input
	clearSearchInput = () => {
		browserHistory.push('/discuss');
	}
	// Change discuss oredering
	handleFilterChange = (e, index, value) => {
		this.props.changeDiscussOrdering(value);
	}
	handleEnter = (e) => {
		if (e.key === 'Enter') {
			browserHistory.push(`/discuss/filter/${e.target.value}`);
		}
	}
	render() {
		return (
			<div className="discuss" style={styles.container}>
				<div className="toolbar" style={styles.toolbar}>
					<div className="search" style={styles.search}>
						<SearchIcon color={grey700} style={styles.searchIcon} />
						<AutoComplete
							style={styles.searchInput}
							menuStyle={styles.searchSuggestionsList}
							hintText="Search..."
							searchText={this.props.query}
							underlineStyle={{ display: 'none' }}
							dataSource={this.state.suggestions}
							onUpdateInput={this.handleUpdateInput}
							onNewRequest={this.loadQuestionByState}
							filter={() => true}
							onKeyPress={this.handleEnter}
						/>
						{this.props.query.length > 0
							&& <Clear color={grey700} style={styles.clearIcon} onClick={this.clearSearchInput} />}
					</div>
					<DropDownMenu
						style={styles.discussFilter}
						value={this.props.ordering}
						onChange={this.handleFilterChange}
						autoWidth={false}
					>
						<MenuItem style={styles.discussFilterItem} value={8} primaryText="Trending" />
						<MenuItem style={styles.discussFilterItem} value={1} primaryText="Most Recent" />
						<MenuItem style={styles.discussFilterItem} value={2} primaryText="Most Popular" />
						<MenuItem style={styles.discussFilterItem} value={3} primaryText="Most Answered" />
						<MenuItem style={styles.discussFilterItem} value={4} primaryText="Unanswered" />
						<MenuItem style={styles.discussFilterItem} value={5} primaryText="My Questions" />
						<MenuItem style={styles.discussFilterItem} value={6} primaryText="My Answers" />
					</DropDownMenu>
				</div>
				<Questions
					questions={this.props.questions}
					isLoaded={this.props.isLoaded}
					ordering={this.props.ordering}
					query={this.props.params.query}
					isUserProfile={false}
					ref={(questions) => { this._questions = questions; }}
				/>
				<Link style={{ textDecoration: 'none' }} to="/discuss/new">
					<FloatingActionButton
						style={styles.addButton}
						zDepth={3}
						secondary
					>
						<ContentAdd />
					</FloatingActionButton>
				</Link>
			</div>
		);
	}
}

export default QuestionsBase;
