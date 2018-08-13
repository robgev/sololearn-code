import React from 'react';
import { Link } from 'react-router';
import { truncate } from 'utils';
import { grey700 } from 'material-ui/styles/colors';
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote';

import 'styles/Feed/codeFeedItem.scss';

const Comment = ({ comment, url }) => (
	<div className="comment-item-container">
		<Link to={url} className="comment-feed-item-wrapper">
			<QuoteIcon
				color={grey700}
				style={{ flex: 'none', transform: 'scale(-1, -1)', alignSelf: 'flex-end' }}
			/>
			<p className="comment-text">
				{truncate(comment.message, 200, 5, true)}
			</p>
			<QuoteIcon
				color={grey700}
				style={{ flex: 'none' }}
			/>
		</Link>
	</div>
);

export default Comment;
