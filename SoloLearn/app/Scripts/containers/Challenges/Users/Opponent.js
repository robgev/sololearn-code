// React modules
import React from 'react';

// Redux modules
import { connect } from 'react-redux';
import { createContestInternal } from 'actions/challenges';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

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

const Opponent = ({ opponent, createContest }) => (
	<div
		tabIndex={0}
		role="button"
		style={styles.opponent}
		onClick={() => createContest(opponent.id)}
	>
		<div style={styles.authorDetails}>
			<ProfileAvatar
				size={35}
				withUserNameBox
				userID={opponent.id}
				userName={opponent.name}
				avatarUrl={opponent.avatarUrl}
			/>
		</div>
		<p style={styles.level}>LEVEL {opponent.level}</p>
	</div>
);

const mapDispatchToProps = {
	createContest: createContestInternal,
};

export default connect(null, mapDispatchToProps)(Opponent);
