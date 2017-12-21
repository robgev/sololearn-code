// React modules
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';

// Redux modules
import {
	emptyAllPlayers,
	getAllPlayersInternal,
	createContestInternal,
} from 'actions/challenges';
import { isLoaded } from 'reducers';

// Material UI components
import TextField from 'material-ui/TextField';
import SearchIcon from 'material-ui/svg-icons/action/search';
import Clear from 'material-ui/svg-icons/content/clear';
import RaisedButton from 'material-ui/RaisedButton';
import { grey700 } from 'material-ui/styles/colors';

// Additional components
import Opponents from './Opponents';

const styles = {
	container: {
		position: 'relative',
	},

	toolbar: {
		display: 'flex',
		alignItems: 'center',
		padding: '5px',
		boxShadow: '0 5px 3px rgba(0,0,0,.12)',
	},

	searchInput: {
		margin: '0 5px',
	},

	clearIcon: {
		cursor: 'pointer',
	},

	footer: {

	},
};

const mapStateToProps = state => ({
	isLoaded: isLoaded(state, 'allPlayers'),
	opponents: state.challenges.allPlayers,
	courseId: state.challenges.courseId,
});

const mapDispatchToProps = {
	createContest: createContestInternal,
	getAllPlayersInternal,
	emptyAllPlayers,
};

@connect(mapStateToProps, mapDispatchToProps)
class AllPlayers extends PureComponent {
state = {
	query: '',
}

// Handle search
handleInputChange = (e) => {
	this.setState({ query: e.target.value });
}

// Detect enter on input
handleKeyPress = (e) => {
	if (e.key === 'Enter' && this.state.query.length > 0) {
		this.props.emptyAllPlayers().then(() => {
			this.opponents.loadOpponents();
		});
	}
}

// Clear search input
clearSearchInput = () => {
	this.setState({ query: '' });
	this.props.emptyAllPlayers().then(() => {
		this.opponents.loadOpponents();
	});
}

getOpponents = () => this.props.getAllPlayersInternal(this.state.query, this.props.courseId)

selectRandomOpponent = () => {
	const { createContest } = this.props;
	createContest();
}

render() {
	return (
		<div id="all-players" style={styles.container}>
			<div className="toolbar" style={styles.toolbar}>
				<SearchIcon color={grey700} style={styles.searchIcon} />
				<TextField
					hintText="Search..."
					style={styles.searchInput}
					underlineStyle={{ display: 'none' }}
					value={this.state.query}
					onChange={this.handleInputChange}
					onKeyPress={this.handleKeyPress}
					fullWidth
				/>
				{ this.state.query.length > 0 &&
					<Clear color={grey700} style={styles.clearIcon} onClick={this.clearSearchInput} />
				}
			</div>
			<Opponents
				notFollowers
				getOpponents={this.getOpponents}
				opponents={this.props.opponents}
				isLoaded={this.props.isLoaded}
				ref={(opponents) => { this.opponents = opponents; }}
			/>
			<div style={styles.footer}>
				<RaisedButton
					secondary
					label="Random Opponent"
					onClick={this.selectRandomOpponent}
				/>
			</div>
		</div>
	);
}
}

export default AllPlayers;
