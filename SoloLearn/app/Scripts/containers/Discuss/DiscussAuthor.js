import React, { Component } from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';
import { styles } from './Reply';
import updateDate from '../../utils/dateFormatter';

const ProfileAvatar = ({ date, userID, userName }) => (
	<Link to={`/profile/${userID}`} style={styles.linkStyle}>
		<div style={styles.authorDetails}>
			<div style={styles.texts.base}>
				<p style={styles.texts.userName}>{userName}</p>
				<p style={styles.texts.date}>{updateDate(date)}</p>
			</div>
			<Avatar size={30} style={styles.avatar}>{userName.charAt(0)}</Avatar>
		</div>
	</Link>
);

export default ProfileAvatar;
