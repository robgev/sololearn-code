import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';

import { followSuggestion } from 'actions/discover';
import { numberFormatter, showError } from 'utils';
import 'styles/components/UserCard.scss';

const CustomWrapper = ({ children, className }) => (
	<span className={className}>
		{children}
	</span>
);

@connect(null, { followSuggestion })
class UserCard extends Component {
handleFollow = () => {
	const { id, isFollowing } = this.props;
	this.props.followSuggestion({ id, isFollowing })
		.catch((e) => {
			showError(e, `Something went wrong when trying to ${isFollowing ? 'unfollow' : 'follow'}`);
			this.props.followSuggestion({ id, isFollowing });
		});
}

render() {
	const {
		id,
		level,
		name,
		withLink,
		followers,
		avatarUrl,
		isFollowing,
		className = '',
		withFollowButton,
	} = this.props;
	const WrapperComponent = withLink ? Link : CustomWrapper;
	return (
		<div className={`discover-user-card-container ${className}`}>
			<WrapperComponent to={`/profile/${id}`} className="profile-container">
				<div className="profile-avatar-wrapper">
					<img src={avatarUrl} alt="avatar" className="profile-avatar" />
				</div>
				<div className="profile-data">
					<div>

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
					</div>

					{withFollowButton ?
						<RaisedButton
							secondary={isFollowing}
							onClick={this.handleFollow}
							style={{ height: 28, marginBottom: 5 }}
							buttonStyle={{ height: 28, lineHeight: '28px' }}
							className="user-card-follow-button"
							label={isFollowing ? 'Following' : 'Follow'}
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
