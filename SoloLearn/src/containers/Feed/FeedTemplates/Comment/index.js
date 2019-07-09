import React from 'react';
import { truncate } from 'utils';
import {
	Container,
	Link,
	SecondaryTextBlock,
} from 'components/atoms';

import './styles.scss';
import BottomToolbarWithVotes from '../../BottomToolbarWithVotes';

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
		<Container className="feed_comment-item-container">
			<Link to={url} className="comment-feed-item-wrapper">
				<SecondaryTextBlock className="comment-text">
					{truncate(comment.message, 200, 5, true)}
				</SecondaryTextBlock>
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
