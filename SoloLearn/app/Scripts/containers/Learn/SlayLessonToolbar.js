import React from 'react';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import IconButton from 'material-ui/IconButton';
import { grey500 } from 'material-ui/styles/colors';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border';

const SlayLessonToolbar = ({
	id,
	userData, // User data contains avatarURL, userName and userID
	timePassed,
	isBookmarked,
	toggleBookmark,
}) => (
	<div className="lesson-toolbar">
		<div className="lesson-data">
			<IconButton
				onClick={toggleBookmark}
				className="search-button"
			>
				{ isBookmarked ?
					<BookmarkIcon color={grey500} /> :
					<BookmarkBorderIcon color={grey500} />
				}
			</IconButton>
		</div>
		<div className="author-data">
			<ProfileAvatar
				{...userData}
				withTooltip
				withUserNameBox
				timePassed={timePassed}
				tooltipId={`lesson-${id}`}
			/>
		</div>
	</div>
);

export default SlayLessonToolbar;
