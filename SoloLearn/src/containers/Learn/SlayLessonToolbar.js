import React from 'react';
import ProfileAvatar from 'components/ProfileAvatar';
import UserTooltip from 'components/UserTooltip';

import IconButton from 'material-ui/IconButton';
import { grey500 } from 'material-ui/styles/colors';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border';

const SlayLessonToolbar = ({
	userData, // User data contains avatarURL, userName and userID
	timePassed,
	isBookmarked,
	withAuthorInfo,
	toggleBookmark,
}) => (
	<div className="lesson-toolbar">
		<div className="lesson-data">
			<IconButton
				onClick={toggleBookmark}
				className="search-button hoverable-icon"
			>
				{ isBookmarked ?
					<BookmarkIcon color={grey500} /> :
					<BookmarkBorderIcon color={grey500} />
				}
			</IconButton>
		</div>
		{ withAuthorInfo &&
			<div className="author-data">
				<UserTooltip userData={userData}>
					<ProfileAvatar
						{...userData}
						withUserNameBox
						timePassed={timePassed}
					/>
				</UserTooltip>
			</div>
		}
	</div>
);

export default SlayLessonToolbar;
