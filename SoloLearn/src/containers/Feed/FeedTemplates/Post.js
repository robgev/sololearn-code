import React from 'react';
import { Link } from 'react-router';
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote';
import { grey700 } from 'material-ui/styles/colors';
import { truncate } from 'utils';
import BottomToolbar from '../FeedBottomToolbar';

const styles = {
	post: {
		display: 'flex',
		width: 'inherit',
		padding: '7px',
		backgroundColor: '#F5F5F5',
		position: 'relative',
		zIndex: 2,
		textDecoration: 'none',
	},
	quoteIcon: {
		base: {
			flex: 'none',
		},
		bottom: {
			transform: 'scale(-1, -1)',
			alignSelf: 'flex-end',
		},
	},
	postName: {
		fontSize: '14px',
		color: '#777',
		margin: '0 10px',
		flex: 2,
		wordBreak: 'break-word',
	},
};

const Post = ({
	url,
	post,
	vote,
	date,
	votes,
	noVotes,
	onUpvote,
	isQuestion,
	onDownvote,
	containerStyle,
}) => (
	<div style={containerStyle}>
		<Link
			to={url}
			style={styles.post}
		>
			<QuoteIcon
				color={grey700}
				style={{ ...styles.quoteIcon.base, ...styles.quoteIcon.bottom }}
			/>
			<p
				style={styles.postName}
			>
				{truncate(isQuestion ? post.title : post.message, 200, 5, true)}
			</p>
			<QuoteIcon
				color={grey700}
				style={styles.quoteIcon.base}
			/>
		</Link>
		{ !noVotes &&
			<BottomToolbar
				date={date}
				userVote={vote}
				totalVotes={votes}
				onUpvote={onUpvote}
				onDownvote={onDownvote}
			/>
		}
	</div>
);

export default Post;
