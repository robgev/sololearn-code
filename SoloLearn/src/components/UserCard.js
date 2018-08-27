import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import AvatarColors from 'constants/AvatarColors';

import { followSuggestion } from 'actions/discover';
import ModBadge from 'components/ModBadge';
import { numberFormatter, showError, determineBadge } from 'utils';
import 'styles/components/UserCard.scss';

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
		badge,
		followers,
		avatarUrl,
		isFollowing,
		className = '',
		withFollowButton,
	} = this.props;
	const modBadge = determineBadge(badge);
	return (
		<div className={`discover-user-card-container ${className}`}>
			<Link to={`/profile/${id}`} className="profile-container">
				<div className="profile-avatar-wrapper">
					{ avatarUrl
						? <img src={avatarUrl} alt="avatar" className="profile-avatar" />
						:	<div style={{ backgroundColor: AvatarColors[id % AvatarColors.length] }} className="profile-avatar">{name ? name.toUpperCase().charAt(0) : ''}</div>
					}
				</div>
				<div className="profile-data">
					<div className="profile-data-wrapper">

						<div className="profile-name">
							{name}
							<ModBadge
								badge={modBadge}
								className="small"
							/>
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
			</Link>

		</div>
	);
}
}

export default UserCard;
