import React, { Component } from 'react';
import { Link } from 'react-router';
import { numberFormatter } from 'utils';
import Service from 'api/service';
import 'styles/components/Shared/UserCard.scss';

class UserCard extends Component {
state = {
	following: false,
}

handleFollowClick = () => {
	const { following } = this.state;
	const { id } = this.props;
	const endpoint = following ? 'Profile/Unfollow' : 'Profile/Follow';
	this.setState({ following: !following });
	Service.request(endpoint, { id })
		.then((response) => {
			if (!response.isSuccessful) {
				this.setState({ following: false });
			}
		});
}

render() {
	const {
		avatarUrl,
		followers,
		level,
		name,
		isFollowing,
		id,
	} = this.props;
	const { following } = this.state;
	return (
		<div className="user-card-container">
			<div className="profile-container">
				<img src={avatarUrl} alt="avatar" className="profile-avatar" />
				<div className="profile-data">
					<div className="profile-name">
						{name}
					</div>
					<div className="profile-more-data">
						<div className="profile-followers">
							{numberFormatter(followers)} Followers
						</div>
						<div className="profile-level">
								Level {level}
						</div>
					</div>
				</div>
			</div>
			<div
				className={following ? 'following-button' : 'follow-button'}
				onClick={this.handleFollowClick}
			>
				{following ? 'Following' : 'Follow'}
			</div>
		</div>
	);
}
}

export default UserCard;
