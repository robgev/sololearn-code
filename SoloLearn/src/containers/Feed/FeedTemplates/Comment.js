import React from 'react';
import { truncate } from 'utils';
import BottomToolbarWithVotes from '../BottomToolbarWithVotes'
import {
	Container,
	Link,
	SecondaryTextBlock,
} from 'components/atoms';
import { QuoteIcon } from 'components/icons';

import 'styles/Feed/codeFeedItem.scss';

const Comment = ({ 
	comment,
	url,
	date,
	userVote,
	totalVotes,
	onChange,
	type,
}) => (
	<Container>
		<Container className="comment-item-container">
			<Link to={url} className="comment-feed-item-wrapper">
				<QuoteIcon/>
				<SecondaryTextBlock className="comment-text">
					{truncate(comment.message, 200, 5, true)}
				</SecondaryTextBlock>
				<QuoteIcon/>
			</Link>
		</Container>
		<BottomToolbarWithVotes
			type={type}
			date={date}
			id={comment.id}
			userVote={userVote}
			totalVotes={totalVotes}
			onChange={onChange}
		/>
	</Container>
);

export default Comment;
