// React modules
import React, { PureComponent } from 'react';
import { StyleRoot } from 'radium';
import { connect } from 'react-redux';
// Material UI components
import Paper from 'material-ui/Paper';
// Redux modules
import { getContest, setContest } from 'actions/challenges';
import { isLoaded } from 'reducers';
// Additional components
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Game from './Game';

const styles = {
	challengeWrapper: {
		position: 'relative',
		width: '1000px',
		height: '500px',
		margin: '15px auto',
		overflow: 'hidden',
	},
};

class Challenge extends PureComponent {
	componentDidMount() {
		const { id } = this.props.params;
		if (!this.props.isLoaded) {
			this.props.getContest(id);
		}
	}

	componentWillUnmount() {
		this.props.setContest(null);
	}

	updateContest = () => {
		const { id } = this.props.params;
		return this.props.getContest(id);
	}

	render() {
		const {
			contest,
			courses,
			isActiveContestLoaded,
		} = this.props;

		return (
			<StyleRoot>
				<Paper id="challenge" style={styles.challengeWrapper}>
					{isActiveContestLoaded ?
						<Game
							contest={contest}
							courseName={courses.find(item => item.id === contest.courseID).languageName}
							updateContest={this.updateContest}
						/> :
						<LoadingOverlay />
					}
				</Paper>
			</StyleRoot>
		);
	}
}

const mapStateToProps = state => ({
	isActiveContestLoaded: isLoaded(state, 'activeContest'),
	contest: state.challenges.activeContest,
	courses: state.courses,
});

const mapDispatchToProps = {
	setContest, getContest,
};

export default connect(mapStateToProps, mapDispatchToProps)(Challenge);
