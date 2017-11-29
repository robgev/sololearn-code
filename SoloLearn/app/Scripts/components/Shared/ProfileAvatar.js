import React, { Component } from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import { updateDate } from 'utils';

const styles = {
	authorDetails: {
		display: 'flex',
		alignItems: 'center',
		fontSize: '12px',
	},
	texts: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			textAlign: 'right',
		},
		userName: {
			color: '#607D8B',
			margin: '0 0 2px 0',
		},
		date: {
			color: '#777',
		},
	},
	avatar: {
		margin: '0 5px',
	},
	noStyle: {
		textDecoration: 'none',
	},
};

const ProfileAvatar = ({
	style,
	userID,
	size = 30,
	userName,
	avatarUrl,
}) => (
	<Link to={`/profile/${userID}`} style={{ ...style, ...styles.noStyle }}>
		<div style={styles.authorDetails}>
			{ avatarUrl ?
				<Avatar
					size={size}
					src={avatarUrl}
					style={styles.avatar}
				/>
				:
				<Avatar
					size={size}
					style={styles.avatar}
				>{userName.toUpperCase().charAt(0)}
				</Avatar>
			}
			{ userName &&
				<div style={styles.texts.base}>
					<p style={styles.texts.name}>{userName}</p>
				</div>
			}
		</div>
	</Link>
);

export default ProfileAvatar;
