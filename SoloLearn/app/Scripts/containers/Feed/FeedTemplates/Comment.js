import React from 'react';
import { Link } from 'react-router';
// Use truncate util function if you had a bug and need to truncate the text

import 'styles/Feed/codeFeedItem.scss';

const Comment = ({ comment, url }) => (
	<div className="comment-item-container">
		<Link to={url} className="comment-feed-item-wrapper">
			<p className="comment-text">
				{comment.message}
			</p>
		</Link>
	</div>
);

export default Comment;
