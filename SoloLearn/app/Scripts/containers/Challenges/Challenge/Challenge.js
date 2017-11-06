// React modules
import React, { Component } from 'react';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getContestInternal, getContest } from '../../../actions/challenges';
import { isLoaded } from '../../../reducers';
import Radium, { StyleRoot } from 'radium';
// Additional components
import Game from './Game/Game';
import LoadingOverlay from '../../../components/Shared/LoadingOverlay';

// Material UI components
import Paper from 'material-ui/Paper';

// App defaults and utils
import contestTypes from '../../../defaults/contestTypes';
import getSyles from '../../../utils/styleConverter';

const styles = {
	challengeWrapper: {
		position: 'relative',
		width: '1000px',
		height: '500px',
		margin: '15px auto',
		overflow: 'hidden',
	},
};

class Challenge extends Component {
	componentDidMount() {
		const { id } = this.props.params;
		if (!this.props.isLoaded) {
			this.props.getContestInternal(id);
		}
	}
	componentWillUnmount() {
		this.props.getContest(null);
	}
    updateContest = () => {
    	const { id } = this.props.params;
    	return this.props.getContestInternal(id);
    }
    renderChallenge = (contest, courses) => {
    	const contestStatus = contest.player.status;
    	const courseName = courses.find(item => item.id == contest.courseID).languageName;
    	return (
    		<Game
		contest={contest}
    			courseName={courseName}
		updateContest={this.updateContest}
	/>
    	);
    }

    render() {
    	const { isLoaded, contest, courses } = this.props;

    	return (
	<StyleRoot>
    			<Paper id="challenge" style={styles.challengeWrapper}>
    				{isLoaded ? this.renderChallenge(contest, courses) : <LoadingOverlay />}
  </Paper>
    		</StyleRoot>
    	);
    }
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'activeContest'),
		contest: state.challenges.activeContest,
		courses: state.courses,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getContest, getContestInternal,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
