import React, { Component } from 'react';
import { Link } from 'react-router';
import { toast } from 'react-toastify';
import RaisedButton from 'material-ui/RaisedButton';

import Service from 'api/service';
import { numberFormatter, showError } from 'utils';
import 'styles/components/UserCard.scss';

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
	try {
		this.setState({ following: !following });
		const res = await Service.request(endpoint, { id });
		if (res.error) {
			showError(res.error.data);
		}
	} catch (e) {
		toast.error(`❌Something went wrong when trying to ${following ? 'unfollow' : 'follow'}: ${e.message}`);
	}
}

render() {
	const {
		id,
		level,
		name,
		withLink,
		followers,
		avatarUrl,
		className = '',
		withFollowButton,
	} = this.props;
	const { following } = this.state;
	const WrapperComponent = withLink ? Link : CustomWrapper;
	return (
		<div className={`discover-user-card-container ${className}`}>
			<WrapperComponent to={`/profile/${id}`} className="profile-container">
				<div className="profile-avatar-wrapper">
					<img src={avatarUrl} alt="avatar" className="profile-avatar" />
				</div>
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
						Level {numberFormatter(level)}
					</div>
					}
					{withFollowButton ?
						<RaisedButton
							secondary={following}
							onClick={this.handleFollow}
							className="user-card-follow-button"
							label={following ? 'Following' : 'Follow'}
						/> : (
							<Link to={`/profile/${id}`} className="user-card-follow-button">
								<RaisedButton
									label="View Profile"
								/>
							</Link>
						)
					}
				</div>
			</WrapperComponent>

		</div>
	);
}
}

export default UserCard;
