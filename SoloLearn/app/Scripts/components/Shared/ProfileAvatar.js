import React from 'react';
import { Link } from 'react-router';
import Avatar from 'material-ui/Avatar';

const styles = {
	authorDetails: {
		display: 'flex',
		alignItems: 'center',
		fontSize: '12px',
	},
	texts: {
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
	metaInfoContainer: {
		display: 'flex',
		flexDirection: 'column',
		justifyContent: 'space-between',
	},
};

const ProfileAvatar = ({
	style,
	userID,
	size = 30,
	userName,
	avatarUrl,
	timePassed,
	withUserNameBox,
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
			<div style={styles.metaInfoContainer}>
				{ withUserNameBox &&
					<div>
						<p style={styles.texts.name}>{userName}</p>
					</div>
				}
				{ timePassed &&
					<div>
						<p style={styles.texts.name}>{timePassed}</p>
					</div>
				}
			</div>
		</div>
	</Link>
);

export default ProfileAvatar;
