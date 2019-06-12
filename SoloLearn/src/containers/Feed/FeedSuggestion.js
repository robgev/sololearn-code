// React modules
import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
// import ProfileAvatar from './ProfileAvatar';
import { followUserSuggestion } from 'actions/feed';
import { numberFormatter } from 'utils';
import { PaperContainer, FlexBox, Image, SecondaryTextBlock } from 'components/atoms';
import { UsernameLink, RaisedButton, ProfileAvatar } from 'components/molecules';

import 'styles/Feed/FeedSuggestion.scss';

const mapDispatchToProps = {
	followUser: followUserSuggestion,
};

const FeedSuggestion = ({ t, suggestion, followUser }) => {
	const {
		id,
		followers,
		isFollowing,
	} = suggestion;
	console.clear();
	console.log('suggestion: ', suggestion);
	return (
		<PaperContainer className="user">
			<ProfileAvatar
				user={suggestion}
				className="feed-suggestion-avatar"
			/>
			<UsernameLink to={`/profile/${suggestion.id}`}>{suggestion.name}</UsernameLink>
			<FlexBox align className="feed-suggestion-info-container">
				<FlexBox align className="suggestion-info-container-1">
					<Image src="/assets/followers_icon_2x.png" className="suggestion-follower-icon" />
					<SecondaryTextBlock>
						{numberFormatter(followers)}
					</SecondaryTextBlock>
				</FlexBox>
				<FlexBox align>
					<Image src="/assets/level_icon.png" className="suggestion-level-icon" />
					<SecondaryTextBlock>
						{suggestion.level}
					</SecondaryTextBlock>
				</FlexBox>
			</FlexBox>
			<RaisedButton
				color="primary"
				onClick={() => followUser({ id, isFollowing })}
				className="suggestion-follow-button"
			>
				{isFollowing ? t('common.user-following') : t('common.follow-user')}
			</RaisedButton>
		</PaperContainer>
	);
};

export default connect(null, mapDispatchToProps)(translate()(FeedSuggestion));
