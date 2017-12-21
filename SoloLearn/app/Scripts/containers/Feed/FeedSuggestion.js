// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import { blueGrey900 } from 'material-ui/styles/colors';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import { followUserInternal, unfollowUserInternal } from 'actions/profile';

const styles = {
	user: {
		display: 'inline-flex',
		justifyContent: 'center',
		alignItems: 'center',
		textAlign: 'center',
		flexDirection: 'column',
		height: '150px',
		width: '150px',
	},

	avatar: {
		margin: '0 0 5px 0',
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
		fontSize: '12px',
		color: '#8BC34A',
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
	followUser: followUserInternal,
	unfollowUser: unfollowUserInternal,
};

@connect(null, mapDispatchToProps)
class FeedSuggestion extends Component {
	state = {
		following: false,
	}

	handleFollow = () => {
		const { suggestion: { id }, followUser, unfollowUser } = this.props;
		const newFollowingValue = !this.state.following;
		this.setState({ following: newFollowingValue });

		if (newFollowingValue) {
			followUser(id, null);
		} else {
			unfollowUser(id, null);
		}
	}

	render() {
		const { following } = this.state;
		const { suggestion } = this.props;

		return (
			<Paper className="user" style={styles.user}>
				<ProfileAvatar
					size={50}
					withUserNameBox
					style={styles.avatar}
					userID={suggestion.id}
					userName={suggestion.name}
					avatarUrl={suggestion.avatarUrl}
				/>
				<p style={styles.followers}>Followers {suggestion.followers}</p>
				<RaisedButton
					labelColor="#fff"
					secondary={following}
					onClick={this.handleFollow}
					backgroundColor={blueGrey900}
					style={styles.followButton.base}
					labelStyle={styles.followButton.label}
					label={following ? 'Following' : 'Follow'}
					buttonStyle={styles.followButton.button}
				/>
			</Paper>
		);
	}
}

export default FeedSuggestion;
