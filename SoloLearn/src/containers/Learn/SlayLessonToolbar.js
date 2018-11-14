import React from 'react';
import { Container, IconButton } from 'components/atoms';
import { Avatar, UserTooltip } from 'components/molecules';
import { 	Bookmark, BookmarkBorder } from 'components/icons';

const SlayLessonToolbar = ({
	userData, // User data contains avatarURL, userName and userID
	timePassed,
	isBookmarked,
	withAuthorInfo,
	toggleBookmark,
}) => (
	<Container className="lesson-toolbar">
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
			<Container className="author-data">
				<UserTooltip userData={userData}>
					<Avatar
						{...userData}
						withUserNameBox
						timePassed={timePassed}
					/>
				</UserTooltip>
			</Container>
		}
	</Container>
);

export default SlayLessonToolbar;
