import React from 'react';
import { truncate } from 'utils';
import BottomToolbarWithVotes from '../BottomToolbarWithVotes';
import {
	Container,
	Link,
	SecondaryTextBlock,
} from 'components/atoms';
import { QuoteIcon } from 'components/icons';

import 'styles/Feed/FeedTemplates/Post.scss';

const Post = ({
	url,
	post,
	vote,
	date,
	votes,
	noVotes,
	isQuestion,
	onChange,
	id,
}) => (
	<Container className="feed-post-container">
		<Link
			to={url}
			className="post"
		>
			<QuoteIcon
				className="quoteIcon base bottom"
			/>
			<SecondaryTextBlock
				className="postName"
			>
				{truncate(isQuestion ? post.title : post.message, 200, 5, true)}
			</SecondaryTextBlock>
			<QuoteIcon
				className="quoteIcon base bottom"
			/>
		</Link>
		{ !noVotes &&
			<BottomToolbarWithVotes
				date={date}
				type='post'
				userVote={vote}
				id={id}
				totalVotes={votes}
				onChange={onChange}
			/>
		}
	</Container>
);

export default Post;
