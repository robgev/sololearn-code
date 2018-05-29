// React modules
import React from 'react';

// Additional data and components
import User from './User';

const styles = {
	challenge: {
		display: 'flex',
		justifyContent: 'center',
		alignItems: 'center',
	},

	score: {
		fontSize: '25px',
		fontWeight: 500,
		color: '#545454',
	},
};

const Challenge = ({
	openPopup,
	contest: { courseID, player, opponent },
}) => (
	<div className="challenge" style={styles.challenge}>
		<User
			disabled
			user={player}
			courseId={courseID}
			openPopup={openPopup}
		/>
		<div className="score" style={styles.score}>
			<span>{player.score}</span>
			<span> : </span>
			<span>{opponent.score}</span>
		</div>
		<User
			disabled
			user={opponent}
			courseId={courseID}
			openPopup={openPopup}
		/>
	</div>
);

export default Challenge;
