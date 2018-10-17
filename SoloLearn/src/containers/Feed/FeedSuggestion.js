// React modules
import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { blueGrey900 } from 'material-ui/styles/colors';
import ProfileAvatar from 'components/ProfileAvatar';
import UserTooltip from 'components/UserTooltip';
import { followUserSuggestion } from 'actions/feed';
import { numberFormatter } from 'utils';

import 'styles/Feed/FeedSuggestion.scss';

const styles = {
	user: {
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		flexDirection: 'column',
		height: '140px',
		width: '140px',
		margin: '0 5px',
	},

	userName: {
		fontSize: '13px',
		margin: '0 0 5px 0',
		textOverflow: 'ellipsis',
		whiteSpace: 'nowrap',
		overflow: 'hidden',
		width: '100px',
	},

	followers: {
		fontSize: '11px',
		color: '#827E7E',
	},

	followButton: {
		base: {
			margin: '5px 0 0 0',
		},

		button: {
			height: '25px',
			lineHeight: '25px',
		},

		label: {
			fontSize: '11px',
		},
	},
};

const mapDispatchToProps = {
	followUser: followUserSuggestion,
};

const FeedSuggestion = ({ t, suggestion, followUser }) => {
	const {
		id,
		name,
		followers,
		avatarUrl,
		isFollowing,
	} = suggestion;

	return (
		<Paper className="user" style={styles.user}>
			<UserTooltip userData={suggestion}>
				<ProfileAvatar
					vertical
					size={50}
					withUserNameBox
					userID={id}
					userName={name}
					avatarUrl={avatarUrl}
					style={{ width: '100%' }}
					className="feed-suggestion-avatar"
				/>
			</UserTooltip>
			<p style={styles.followers}>
				{
					followers === 1
						? `1 ${t('user-followers-one')}`
						: `${numberFormatter(followers)} ${t('common.user-followers')}`
				}
			</p>
			<RaisedButton
				labelColor="#fff"
				secondary={isFollowing}
				backgroundColor={blueGrey900}
				style={styles.followButton.base}
				labelStyle={styles.followButton.label}
				label={isFollowing ? t('common.user-following') : t('common.follow-user')}
				buttonStyle={styles.followButton.button}
				onClick={() => followUser({ id, isFollowing })}
			/>
		</Paper>
	);
};

export default connect(null, mapDispatchToProps)(translate()(FeedSuggestion));
