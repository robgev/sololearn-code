// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

// Redux modules
import { followUserInternal, unfollowUserInternal } from 'actions/profile';

import ProfileAvatar from 'components/Shared/ProfileAvatar';

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

class FollowerItem extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isFollowing: props.follower.isFollowing,
		};

		this.handleFollowing = this.handleFollowing.bind(this);
	}

	handleFollowing(id, follow, fromFollowers) {
		this.setState({ isFollowing: follow });

		if (follow) {
			this.props.followUser(id, fromFollowers);
		} else {
			this.props.unfollowUser(id, fromFollowers);
		}
	}

	render() {
		const {
			t, follower, fromFollowers, isFollowing,
		} = this.props;

		return (
			<div id="follower" style={styles.follower}>
				<div className="details" style={styles.details}>
					<ProfileAvatar
						size={50}
						style={styles.avatar}
						userID={follower.id}
						badge={follower.badge}
						userName={follower.name}
						avatarUrl={follower.avatarUrl}
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
					onClick={
						() => {
							this.handleFollowing(follower.id, !isFollowing, fromFollowers);
						}}
				/>
			</div>
		);
	}

	shouldComponentUpdate(nextProps, nextState) {
		const { follower } = this.props;
		const { isFollowing } = this.state;
		const { follower: newFollowerValue } = nextProps;
		const { isFollowing: newIsFollowingValue } = nextState;
		return (follower !== newFollowerValue || isFollowing !== newIsFollowingValue);
	}
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		followUser: followUserInternal,
		unfollowUser: unfollowUserInternal,
	}, dispatch);
}

export default connect(() => ({}), mapDispatchToProps)(translate()(FollowerItem));
