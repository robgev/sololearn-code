// React modules
import React from 'react';
import ReactGA from 'react-ga';
import Radium from 'radium';
// Material UI components
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import { fadeInRight, fadeInLeft, fadeIn, fadeInUp } from 'react-animations';
import Profile from './Profile';

const styles = {
	container: {
		padding: '50px 0 0 0',
		textAlign: 'center',
	},

	userWrapper: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	user: {
		textAlign: 'center',
		width: '40%',
	},

	avatar: {
		margin: '0 0 8px 0',
	},

	userName: {
		fontWeight: 500,
		color: '#616161',
		margin: '0 0 5px 0',
	},

	level: {
		fontSize: '14px',
	},

	versusStyle: {
		fontSize: '27px',
		fontWeight: 500,
		color: '#455A64',
	},

	languageName: {
		display: 'inline-block',
		width: '120px',
		fontSize: '14px',
		fontWeight: 500,
		padding: '5px',
		color: '#fff',
		backgroundColor: '#607D8B',
		textAlign: 'center',
	},

	result: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
		flexDirection: 'column',
		margin: '20px 0 0 0',
	},

	resultTitle: {
		color: '#7CB342',
		fontWeight: 500,
		margin: '0 0 5px 0',
	},

	rewardXp: {
		width: '95px',
		padding: '3px',
		border: '2px solid #7CB342',
		color: '#7CB342',
		fontWeight: 500,
	},

	button: {
		margin: '50px 10px 0 10px',
	},

	appear: animation => ({
		animation: '750ms',
		animationName: Radium.keyframes(animation, animation.name),
	}),

};

const Start = (props) => {
	ReactGA.ga('send', 'screenView', { screenName: 'Start Challenge Page' });
	const { courseName, contest } = props;
	return (
		<div id="challenge-start" style={styles.container}>
			<div style={styles.userWrapper}>
				<div style={{ ...styles.user, ...styles.appear(fadeInLeft) }}>
					<Profile player={contest.player} />
				</div>
				<span style={styles.versusStyle}>VS</span>
				<div style={{ ...styles.user, ...styles.appear(fadeInRight) }}>
					<Profile player={contest.opponent} />
				</div>
			</div>
			<div style={styles.appear(fadeIn)}>
				<p style={styles.languageName}>{courseName.toUpperCase()}</p>
				<div style={styles.result}>
					<p style={styles.resultTitle}>WINNER GETS</p>
					<p style={styles.rewardXp}>{contest.player.rewardXp} XP</p>
				</div>
			</div>
			<div style={{ ...styles.result, ...styles.appear(fadeInUp) }}>
				<div>
					<RaisedButton
						label="Start"
						style={styles.button}
						secondary
						onClick={props.next}
					/>
					{props.isDeclinable ?
						<RaisedButton
							label="Decline"
							style={styles.button}
							primary
							onClick={props.decline}
						/> : null}
				</div>
			</div>
		</div>
	);
};

export default Radium(Start);
