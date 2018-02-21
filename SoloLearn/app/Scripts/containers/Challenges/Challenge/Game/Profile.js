import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';

// i18next
import { translate } from 'react-i18next';

const styles = {
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
	none: {
		textDecoration: 'none',
	},
};

const Profile = ({ t, player }) => (
	<Link to={`profile/${player.id}`} style={styles.none}>
		<Avatar size={100} style={styles.avatar}>
			{player.name.charAt(0).toUpperCase()}
		</Avatar>
		<p style={styles.userName}>{player.name}</p>
		<p style={styles.level}>{t('play.level')} {player.level}</p>
	</Link>
);

export default translate()(Profile);
