import React from 'react';
import { Link } from 'react-router';
import { truncate } from 'utils';

import 'styles/Feed/codeFeedItem.scss';

const Comment = ({ comment, url }) => (
	<div className="comment-item-container">
		<Link to={url} className="comment-feed-item-wrapper">
			<p className="comment-text">
				{truncate(comment.message, 200, 5, true)}
			</p>
		</Link>
	</div>
);

export default Comment;
