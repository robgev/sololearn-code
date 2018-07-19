// General modules
import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

// Redux modules
import { followUserInternal, unfollowUserInternal } from 'actions/profile';

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

class FollowerItem extends PureComponent {
	constructor(props) {
		super(props);

		this.state = {
			isFollowing: props.follower.isFollowing,
		};
	}

	handleFollowing = () => {
		const {
			follower: { id }, fromFollowers,
		} = this.props;
		const { isFollowing } = this.state;
		this.setState({ isFollowing: !isFollowing });

		if (!isFollowing) {
			this.props.followUser(id, fromFollowers);
		} else {
			this.props.unfollowUser(id, fromFollowers);
		}
	}

	render() {
		const {
			t, follower,
		} = this.props;

		return (
			<div id="follower" style={styles.follower}>
				<div className="details" style={styles.details}>
					<ProfileAvatar
						size={50}
						withTooltip
						style={styles.avatar}
						userID={follower.id}
						level={follower.level}
						badge={follower.badge}
						userName={follower.name}
						avatarUrl={follower.avatarUrl}
						tooltipId={`follower-${follower.id}`}
					/>
					<Link to={`/profile/${follower.id}`} style={styles.authorDetails}>
						<p style={styles.name}>{follower.name}</p>
						<p style={styles.info}>{follower.followers} {t('common.user-followers')} | {t('common.user-level')} {follower.level}</p>
					</Link>
				</div>
				<RaisedButton
					label={this.state.isFollowing ? t('common.user-following') : t('common.follow-user')}
					primary={!this.state.isFollowing}
					secondary={this.state.isFollowing}
					style={styles.followButton.base}
					labelStyle={styles.followButton.label}
					buttonStyle={styles.followButton.button}
					overlayStyle={styles.followButton.overlay}
					onClick={this.handleFollowing}
				/>
			</div>
		);
	}
}

const mapDispatchToProps = {
	followUser: followUserInternal,
	unfollowUser: unfollowUserInternal,
};

export default connect(null, mapDispatchToProps)(translate()(FollowerItem));
