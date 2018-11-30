import React from 'react';
import { Container, IconButton, FlexBox, } from 'components/atoms';
import { ProfileAvatar, UsernameLink, ModBadge } from 'components/molecules';
import { Bookmark, BookmarkBorder } from 'components/icons';

import './SlayLessonToolbar.scss';

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
			//<Container className="author-data">
				<FlexBox>
					<ProfileAvatar user={userData}/>
					<FlexBox align>
						<UsernameLink to={`/profile/${userData.id}`}>
							{userData.name}
						</UsernameLink>
						<ModBadge badge={userData.badge}/>
					</FlexBox>
				</FlexBox>
			//</Container>
		}
	</Container>
);

export default SlayLessonToolbar;
