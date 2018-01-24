import React from 'react';
import { Link } from 'react-router';
import QuoteIcon from 'material-ui/svg-icons/editor/format-quote';
import { grey700 } from 'material-ui/styles/colors';
import VoteControls from 'components/Shared/VoteControls';

const styles = {
	post: {
		display: 'inline-flex',
		width: 'inherit',
		padding: '7px',
		backgroundColor: '#eee',
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
			margin: '10px 0 0 0',
		},
	},
	postName: {
		fontSize: '13px',
		color: '#777',
		margin: '0 10px',
		flex: 2,
	},
};

const Post = ({
	post, isQuestion, url, onUpvote, onDownvote, vote, votes, noVotes,
}) => (
	<div>
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
				{isQuestion ? post.title : post.message}
			</p>
			<QuoteIcon
				color={grey700}
				style={styles.quoteIcon.base}
			/>
		</Link>
		{ !noVotes &&
			<VoteControls
				absolute
				userVote={vote}
				totalVotes={votes}
				onUpvote={onUpvote}
				onDownvote={onDownvote}
			/>
		}
	</div>
);

export default Post;
