// React modules
import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import LeaderboardString from 'components/LeaderboardString';
import {
	Container,
	PaperContainer,
	FlexBox,
	Popup,
	Input,
} from 'components/atoms';
import {
	RaisedButton,
	UsernameLink,
	ContainerLink,
	ProgressBar,
	ProfileAvatar,
	ModBadge,
} from 'components/molecules';

import UserPostEditor from 'containers/UserPostEditor';

import 'styles/Feed/Header.scss';

class Header extends PureComponent {
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
		};
		// this is for random hint selection in the input form like mobile ->
		// this.userPostHintsArray = [
		// 	'user_post.hints.user-post-form-hint-1',
		// 	'user_post.hints.user-post-form-hint-2',
		// 	'user_post.hints.user-post-form-hint-3',
		// ];
		// this.randomHint = this.userPostHintsArray[
		// 	Math.floor(Math.random() * this.userPostHintsArray.length)
		// ];
	}

	inputClickHandler = (e) => {
		e.target.blur();
		this.setState({ isCreatePostPopupOpen: true });
	}

	render() {
		const { profile, t } = this.props;
		const { xp: currentXp, rank, badge } = profile;

		return (
			<PaperContainer className="feed-header">
				<Container className="details-wrapper">
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
				</Container>
				<FlexBox justifyEnd className="actions">
					<RaisedButton color="primary" onClick={() => this.setState({ isCreatePostPopupOpen: true })}>
						Create a Post
					</RaisedButton>
				</FlexBox>
				<Popup
					open={this.state.isCreatePostPopupOpen}
				// onClose={() => this.setState({ isCreatePostPopupOpen: false })}
				>
					<UserPostEditor closePopup={() => this.setState({ isCreatePostPopupOpen: false })} />
				</Popup>
			</PaperContainer>
		);
	}
}

export default translate()(Header);
