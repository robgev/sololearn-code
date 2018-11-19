import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import AvatarColors from 'constants/AvatarColors';
import { followSuggestion } from 'actions/discover';
import ModBadge from 'components/ModBadge';
import { numberFormatter, showError } from 'utils';
import { Container,	Image } from 'components/atoms';
import { UsernameLink, RaisedButton } from 'components/molecules';

import 'styles/components/UserCard.scss';

@connect(null, { followSuggestion })
@translate()
class UserCard extends Component {
	handleFollow = (event) => {
		const { id, isFollowing } = this.props;
		this.props.followSuggestion({ id, isFollowing })
			.catch((e) => {
				showError(e, `Something went wrong when trying to ${isFollowing ? 'unfollow' : 'follow'}`);
				this.props.followSuggestion({ id, isFollowing });
			});
	}

	render() {
		const {
			t,
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
		return (
			<Container className={`discover-user-card-container ${className}`}>
				<Container className="profile-container">
					<Container className="profile-avatar-wrapper">
						{avatarUrl
							? <Image src={avatarUrl} alt="avatar" className="profile-avatar" />
							: (
								<Container
									style={{ backgroundColor: AvatarColors[id % AvatarColors.length] }}
									className="profile-avatar"
								>
									{name ? name.toUpperCase().charAt(0) : ''}
								</Container>
							)
						}
					</Container>
					<Container className="profile-data">
						<Container className="profile-data-wrapper">
							<UsernameLink  to={`/profile/${id}`}>
								<Container>
									{name}
									<ModBadge
										badge={badge}
										className="small"
									/>
								</Container>
							</UsernameLink>
							{(followers || followers === 0) &&
								<Container className="profile-followers">
									{ followers === 1
										? `1 ${t('user-followers-one')}`
										: `${numberFormatter(followers)} ${t('common.user-followers')}`}
								</Container>
							}
							{(level || level === 0) &&
								<Container className="profile-followers">
									{t('common.user-level')} {numberFormatter(level)}
								</Container>
							}
						</Container>

						{withFollowButton ?
							<RaisedButton
								{...(isFollowing ? {color:'secondary'} : {})}
								onClick={this.handleFollow}
								className="user-card-follow-button"
							>
								{isFollowing ? t('common.user-following') : t('common.follow-user')}
							</RaisedButton> : (
								<UsernameLink to={`/profile/${id}`} className="user-card-follow-button">
									<RaisedButton
										label={t('profile.show-profile')}
									/>
								</UsernameLink>
							)
						}
					</Container>
				</Container>

			</Container>
		);
	}
}

export default UserCard;
