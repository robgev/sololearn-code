// React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { createContestInternal } from '../../../actions/challenges';

// Material UI components
import Avatar from 'material-ui/Avatar';

const styles = {
	opponent: {
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
		padding: '10px',
		cursor: 'pointer',
	},

	authorDetails: {
		display: 'flex',
		alignItems: 'center',
	},

	name: {
		margin: '0 0 0 8px',
		fontSize: '14px',
		color: '#424040',
	},

	level: {
		fontSize: '11px',
		color: '#fff',
		backgroundColor: '#455A64',
		padding: '2px',
		width: '60px',
		textAlign: 'center',
	},
};

class Opponent extends Component {
	constructor(props) {
		super(props);
	}

	render() {
		const opponent = this.props.opponent;

		return (
			<div className="opponent" style={styles.opponent} onClick={() => { this.props.createContest(opponent.id); }}>
				<div style={styles.authorDetails}>
					<Avatar size={35}>{opponent.name.charAt(0)}</Avatar>
					<p style={styles.name}>{opponent.name}</p>
				</div>
				<p style={styles.level}>LEVEL {opponent.level}</p>
			</div>
		);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		createContest: createContestInternal,
	}, dispatch);
}

export default connect(() => ({}), mapDispatchToProps)(Opponent);
