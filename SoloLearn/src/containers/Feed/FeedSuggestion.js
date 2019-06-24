// React modules
import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
// import ProfileAvatar from './ProfileAvatar';
import { followUserSuggestion } from 'actions/feed';
import { numberFormatter } from 'utils';
import {
	FlexBox,
	IconLabel,
	Container,
	PaperContainer,
	Image,
	TextBlock,
} from 'components/atoms';
import {
	UsernameLink,
	FlatButton,
	ProfileAvatar,
	IconWithText,
} from 'components/molecules';
import { Level, Followers } from 'components/icons';

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
	return (
		<PaperContainer className="user">
			<ProfileAvatar
				user={suggestion}
				className="feed-suggestion-avatar"
			/>
			<UsernameLink to={`/profile/${suggestion.id}`} className="userName">{suggestion.name}</UsernameLink>
			<FlexBox align className="feed-suggestion-info-container">
				<IconWithText justify Icon={Followers} className="suggestion-followers">
					<IconLabel className="suggestion-info-container">{numberFormatter(followers)} </IconLabel>
				</IconWithText>
				<TextBlock className="suggestion-info-separator">·</TextBlock>
				<IconWithText justify Icon={Level} className="suggestion-level">
					<IconLabel className="suggestion-info-container"> {suggestion.level}</IconLabel>
				</IconWithText>
			</FlexBox>
			<FlatButton
				color="primary"
				onClick={() => followUser({ id, isFollowing })}
			>
				{isFollowing ? t('common.user-following') : t('common.follow-user')}
			</FlatButton>
		</PaperContainer>
	);
};

export default connect(null, mapDispatchToProps)(translate()(FeedSuggestion));
