import React, { Component } from 'react';
import { Link } from 'react-router';
import RaisedButton from 'material-ui/RaisedButton';

import Service from 'api/service';
import { numberFormatter } from 'utils';
import avatars from 'components/Shared/Avatars';
import 'styles/components/Shared/UserCard.scss';

const CustomWrapper = ({ children, className }) => (
	<span className={className}>
		{children}
	</span>
);

class UserCard extends Component {
	constructor(props) {
		super(props);
		this.state = {
			following: props.isFollowing,
		};
	}

handleFollow = async () => {
	const { following } = this.state;
	const { id } = this.props;
	const endpoint = following ? 'Profile/Unfollow' : 'Profile/Follow';
	this.setState({ following: !following });
	const response = await Service.request(endpoint, { id });
	if (!response.isSuccessful) {
		this.setState({ following }); // revert the following state, if there was a server error
	}
}

render() {
	const {
		avatarUrl,
		followers,
		level,
		name,
		id,
		withLink,
	} = this.props;
	const { following } = this.state;
	const WrapperComponent = withLink ? Link : CustomWrapper;
	return (
		<div className="discover-user-card-container">
			<WrapperComponent to={`/profile/${id}`} className="profile-container">
				<img src={avatars[id ? id % 5000 : 0].picture.large} alt="avatar" className="profile-avatar" />

				<div className="profile-data">
					<div className="profile-name">
						{name}
					</div>
					{ (followers || followers === 0) &&
					<div className="profile-followers">
						{numberFormatter(followers)} Followers
					</div>
					}
					{ (level || level === 0) &&
					<div className="profile-followers">
						{numberFormatter(level)} Followers
					</div>
					}
					<RaisedButton
						secondary={following}
						onClick={this.handleFollow}
						label={following ? 'Following' : 'Follow'}
					/>
				</div>
			</WrapperComponent>

		</div>
	);
}
}

export default UserCard;
