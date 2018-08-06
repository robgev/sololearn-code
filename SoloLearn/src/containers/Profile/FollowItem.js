// General modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import { observer } from 'mobx-react';
import RaisedButton from 'material-ui/RaisedButton';

import ProfileAvatar from 'components/ProfileAvatar';

// i18next
import { translate } from 'react-i18next';

const styles = {
	follower: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '10px',
	},

	details: {
		flex: 2,
		display: 'inline-flex',
		alignItems: 'center',
	},

	authorDetails: {
		margin: '0 0 0 8px',
	},

	name: {
		fontSize: '14px',
		color: '#424040',
	},

	info: {
		fontSize: '13px',
	},

	followButton: {
		base: {
			height: '25px',
		},

		label: {
			fontSize: '12px',
		},

		button: {
			height: '25px',
			lineHeight: '25px',
		},

		overlay: {
			height: '25px',
		},
	},
};

@translate()
@observer
class FollowItem extends Component {
	handleFollowClick = () => {
		this.props.onFollowClick(this.props.follow.id);
	}
	render() {
		const {
			t, follow,
		} = this.props;
		return (
			<div id="follower" style={styles.follower}>
				<div className="details" style={styles.details}>
					<ProfileAvatar
						size={50}
						withTooltip
						style={styles.avatar}
						userID={follow.id}
						level={follow.level}
						badge={follow.badge}
						userName={follow.name}
						avatarUrl={follow.avatarUrl}
						tooltipId={`follower-${follow.id}`}
					/>
					<Link to={`/profile/${follow.id}`} style={styles.authorDetails}>
						<p className="hoverable" style={styles.name}>{follow.name}</p>
						<p style={styles.info}>{follow.followers} {t('common.user-followers')} | {t('common.user-level')} {follow.level}</p>
					</Link>
				</div>
				<RaisedButton
					label={follow.isFollowing ? t('common.user-following') : t('common.follow-user')}
					primary={!follow.isFollowing}
					secondary={follow.isFollowing}
					style={styles.followButton.base}
					labelStyle={styles.followButton.label}
					buttonStyle={styles.followButton.button}
					overlayStyle={styles.followButton.overlay}
					onClick={this.handleFollowClick}
				/>
			</div>
		);
	}
}

export default FollowItem;
