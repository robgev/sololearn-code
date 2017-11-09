import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';

const styles = {
	authorDetails: {
		fontSize: '12px',
	},
	texts: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			textAlign: 'right',
		},
		name: {
			color: '#607D8B',
			margin: '0 0 2px 0',
		},
	},
	avatar: {
		margin: '0 5px',
	},
	noStyle: {
		textDecoration: 'none',
	},
};

const User = ({ user: { id, name }, style }) => (
	<Link to={`/profile/${id}`} style={styles.noStyle}>
		<div style={styles.authorDetails}>
			<Avatar size={30} style={styles.avatar}>{name.charAt(0)}</Avatar>
			<div style={styles.texts.base}>
				<p style={styles.texts.name}>{name}</p>
			</div>
		</div>
	</Link>
);

export default User;
