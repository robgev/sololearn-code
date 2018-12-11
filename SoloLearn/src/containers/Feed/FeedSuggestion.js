// React modules
import React from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
//import ProfileAvatar from './ProfileAvatar';
import { followUserSuggestion } from 'actions/feed';
import { numberFormatter } from 'utils';
import { PaperContainer, SecondaryTextBlock, } from 'components/atoms';
import { UsernameLink, RaisedButton, ProfileAvatar } from 'components/molecules'

import 'styles/Feed/FeedSuggestion.scss';

const mapDispatchToProps = {
	followUser: followUserSuggestion,
};

const FeedSuggestion = ({ t, suggestion, followUser }) => {
	const {
		id,
		name,
		followers,
		avatarUrl,
		isFollowing,
	} = suggestion;
	return (
		<PaperContainer className="user">
			
			<ProfileAvatar
				user={suggestion}
				className="feed-suggestion-avatar"
			/>
			<UsernameLink to={`/profile/${suggestion.id}`}>{suggestion.name}</UsernameLink>
			<SecondaryTextBlock className="followers">
				{
					followers === 1
						? `1 ${t('user-followers-one')}`
						: `${numberFormatter(followers)} ${t('common.user-followers')}`
				}
			</SecondaryTextBlock>
			<RaisedButton
				onClick={() => followUser({ id, isFollowing })}
			>
				{isFollowing ? t('common.user-following') : t('common.follow-user')}
			</RaisedButton>
		</PaperContainer>
	);
};

export default connect(null, mapDispatchToProps)(translate()(FeedSuggestion));
