// React modules
import React from 'react';
import { Link } from 'react-router';
import { updateDate, determineBadge } from 'utils';
import ModBadge from 'components/Shared/ModBadge';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

const styles = {
	content: {
		display: 'flex',
	},

	wrapper: {
		margin: '0 0 0 5px',
		flexGrow: 1,
		width: '90%',
	},

	title: {
		fontSize: '13px',
		color: '#545454',
		margin: '0 0 7px 0',
	},

	userName: {
		fontWeight: 500,
		color: '#8BC34A',
		textDecoration: 'none',
	},

	date: {
		fontSize: '11px',
		position: 'absolute',
		bottom: '10px',
		right: '10px',
	},

	votes: {
		margin: '7px 0 0 0',
	},

	voteIcon: {
		width: '15px',
		height: '15px',
		verticalAlign: 'middle',
	},

	voteText: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0 5px',
		color: '#9e9e9e',
		fontSize: '13px',
		width: '25px',
		textAlign: 'center',
	},

	linkStyle: {
		position: 'relative',
		textDecoration: 'none',
		zIndex: 2,
	},
};

const FeedItemBase = ({
	title, user, date, children,
}) => (
	<div className="content" style={styles.content}>
		<ProfileAvatar
			size={40}
			userID={user.id}
			badge={user.badge}
			userName={user.name}
			style={styles.linkStyle}
			avatarUrl={user.avatarUrl}
		/>
		<div className="wrapper" style={styles.wrapper}>
			<p style={styles.title}>
				<Link
					to={`/profile/${user.id}`}
					style={{ ...styles.userName, ...styles.linkStyle }}
				>
					{`${user.name} `}
					<ModBadge
						className="small"
						badge={determineBadge(user.badge)}
					/>
				</Link>
				{title}
			</p>
			{children}
		</div>
		<p className="date" style={styles.date}>{updateDate(date)}</p>
	</div>
);

export default FeedItemBase;
