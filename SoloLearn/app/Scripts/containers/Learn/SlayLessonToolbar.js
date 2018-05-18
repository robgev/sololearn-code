import React from 'react';
import ProfileAvatar from 'components/Shared/ProfileAvatar';

import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { grey500 } from 'material-ui/styles/colors';
import BookmarkIcon from 'material-ui/svg-icons/action/bookmark';
import BookmarkBorderIcon from 'material-ui/svg-icons/action/bookmark-border';

// i18n
import { translate } from 'react-i18next';

const SlayLessonToolbar = ({
	userData, // User data contains avatarURL, userName and userID
	timePassed,
	countLoaded,
	isBookmarked,
	openComments,
	commentsCount,
	toggleBookmark,
	t,
}) => (
	<div className="lesson-toolbar">
		<div className="lesson-data">
			<FlatButton
				onClick={openComments}
				label={`${countLoaded ? commentsCount : ''} ${t('common.comments')}`}
			/>
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
				withUserNameBox
				timePassed={timePassed}
			/>
		</div>
	</div>
);

export default translate()(SlayLessonToolbar);
