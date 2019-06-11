// React modules
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
// import LeaderboardString from 'components/LeaderboardString';
import {
	// Container,
	PaperContainer,
	FlexBox,
	Popup,
	Input,
	Image,
} from 'components/atoms';
import {
	// UsernameLink,
	// ProgressBar,
	ProfileAvatar,
	// ModBadge,
} from 'components/molecules';

import UserPostEditor from 'containers/UserPostEditor';

import 'styles/Feed/FeedHeader.scss';

class FeedHeader extends PureComponent {
	constructor(props) {
		super(props);
		const { levels, profile } = props;
		const { level: userLevel, xp: currentXp, badge } = profile;
		// Starting from user level we try to find a level
		// That has a status which is not null
		// This means we need to get maxXp of the previous level of that
		// specific status level to get that status
		// That's why we find the index and then set as maxXp
		// the previous level's maxXp
		// If there is no such level, this means the
		// user already has the highest status, so we just
		// show his xp as maxXp, which means no more progress to make
		const nextMilestoneLevelIndex =
			levels.slice(userLevel).findIndex(lvl => lvl.status !== null);
		[ this.currentBadge ] = badge ? badge.split('|') : '';
		if (nextMilestoneLevelIndex !== -1) {
			// Restore index after slice
			this.maxXp = levels[userLevel + nextMilestoneLevelIndex].maxXp;
			this.nextMilestone = levels[userLevel + nextMilestoneLevelIndex].status;
		} else {
			this.maxXp = currentXp;
			[ this.nextMilestone ] = badge ? badge.split('|') : '';
		}
		this.state = {
			isCreatePostPopupOpen: false,
			isCreatePostWithImagePopupOpen: false,
		};
		// this is for random hint selection in the input form like mobile ->
		this.userPostHintsArray = [
			'user_post.hints.user-post-form-hint-1',
			'user_post.hints.user-post-form-hint-2',
			'user_post.hints.user-post-form-hint-3',
		];
		this.randomHint = this.userPostHintsArray[
			Math.floor(Math.random() * this.userPostHintsArray.length)
		];
	}

	inputClickHandler = (e) => {
		e.target.blur();
		this.setState({ isCreatePostPopupOpen: true });
	}

	clickImageHandler = () => {
		this.setState({ openImageInput: true, isCreatePostPopupOpen: true });
	}

	render() {
		const { profile, t, afterPostCallback } = this.props;
		const { xp: currentXp, rank, badge } = profile;

		return (
			<PaperContainer className="feed-header">
				{/* <Container className="details-wrapper">
					<ProfileAvatar
						user={profile}
					/>
					<Container className="details">
						<FlexBox>
							<UsernameLink to={`/profile/${profile.id}`}>
								{profile.name}
							</UsernameLink>
							<ModBadge badge={badge} className="badge" />
						</FlexBox>
						<LeaderboardString userID={profile.id} ranks={rank} />
						<Container className="profile-progress-wrapper">
							<ProgressBar
								value={100 * currentXp / this.maxXp}
								minText={this.currentBadge ? t(`profile.status-${this.currentBadge}`) : ''}
								maxText={t(`profile.status-${this.nextMilestone}`)}
							/>
						</Container>
					</Container>
				</Container> */}
				<FlexBox className="actions" align fullWith>
					<ProfileAvatar
						user={profile}
					/>
					<Input
						variant="outlined"
						placeholder={`${t(this.randomHint)}, ${profile.name}`}
						className="user-post-hints-input"
						onClick={() => this.setState({ isCreatePostPopupOpen: true })}
					/>
					<Image
						onClick={() => this.setState({ isCreatePostWithImagePopupOpen: true })}
						src="assets/ic_image@2x.png"
						className="user-post-feed-header-image"
					/>
				</FlexBox>
				<Popup
					open={this.state.isCreatePostPopupOpen}
					onClose={() => this.setState({ isCreatePostPopupOpen: false })}
				>
					<UserPostEditor
						closePopup={() => this.setState({ isCreatePostPopupOpen: false })}
						afterPostCallback={afterPostCallback}
					/>
				</Popup>
				<Popup
					open={this.state.isCreatePostWithImagePopupOpen}
					onClose={() => this.setState({ isCreatePostPopupOpen: false })}
				>
					<UserPostEditor
						closePopup={() => this.setState({ isCreatePostWithImagePopupOpen: false })}
						afterPostCallback={afterPostCallback}
						openImageInput
					/>
				</Popup>
			</PaperContainer>
		);
	}
}

export default translate()(FeedHeader);
