import React from 'react';
import { Container, IconButton, FlexBox } from 'components/atoms';
import { ProfileAvatar, UsernameLink, ModBadge } from 'components/molecules';
import { Bookmark, BookmarkBorder } from 'components/icons';

const SlayLessonToolbar = ({
	userData, // User data contains avatarURL, userName and userID
	isBookmarked,
	withAuthorInfo,
	toggleBookmark,
}) => (
	<FlexBox align justifyBetween>
		<Container className="lesson-data">
			<IconButton
				onClick={toggleBookmark}
				className="search-button hoverable-icon"
			>
				{ isBookmarked ?
					<Bookmark /> :
					<BookmarkBorder />
				}
			</IconButton>
		</Container>
		{ withAuthorInfo &&
		<FlexBox>
			<ProfileAvatar user={userData} />
			<FlexBox align>
				<UsernameLink to={`/profile/${userData.id}`}>
					{userData.name}
				</UsernameLink>
				<ModBadge badge={userData.badge} />
			</FlexBox>
		</FlexBox>
		}
	</FlexBox>
);

export default SlayLessonToolbar;
