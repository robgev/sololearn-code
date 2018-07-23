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
		fontSize: 25,
		fontWeight: 500,
		color: '#545454',
		marginBottom: 10,
	},
};

const Challenge = ({
	contest: {
		id, courseID, player, opponent,
	},
}) => (
	<div className="challenge" style={styles.challenge}>
		<User
			id={id}
			disabled
			user={player}
			courseId={courseID}
		/>
		<div className="score" style={styles.score}>
			<span>{player.score}</span>
			<span> : </span>
			<span>{opponent.score}</span>
		</div>
		<User
			id={id}
			disabled
			user={opponent}
			courseId={courseID}
		/>
	</div>
);

export default Challenge;
