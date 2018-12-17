import React from 'react';
import { Container, IconButton, FlexBox } from 'components/atoms';
import { ProfileAvatar, UsernameLink, ModBadge } from 'components/molecules';
import { Bookmark, BookmarkBorder } from 'components/icons';
import './SlayLessonToolbar.scss';

const SlayLessonToolbar = ({
	userData, // User data contains avatarURL, userName and userID
	isBookmarked,
	withAuthorInfo,
	toggleBookmark,
}) => (
	<FlexBox align justifyBetween className="slay-lesson-toolbar">
		<Container className="lesson-data">
			<IconButton
				onClick={toggleBookmark}
				className="search-button"
			>
				{ isBookmarked ?
					<Bookmark /> :
					<BookmarkBorder />
				}
			</IconButton>
		</Container>
		{ withAuthorInfo &&
		<FlexBox>
			<FlexBox align>
				<UsernameLink to={`/profile/${userData.id}`}>
					{userData.name}
				</UsernameLink>
				<ModBadge className="badge" badge={userData.badge} />
			</FlexBox>
			<ProfileAvatar user={userData} />
		</FlexBox>
		}
	</FlexBox>
);

export default SlayLessonToolbar;
