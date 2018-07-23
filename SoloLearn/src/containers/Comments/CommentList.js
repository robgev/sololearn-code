import React from 'react';
import { observer } from 'mobx-react';
import InfiniteScroll from 'components/InfiniteScroll';
import Comment from './Comment';

const CommentList = observer(props => (
	<InfiniteScroll
		loadMore={props.loadMore}
		hasMore={props.infinite && props.hasMore}
		style={{
			display: 'flex',
			width: '100%',
			flexDirection: 'column',
		}}
	>
		{props.comments.map(comment => (
			<Comment
				ref={props.commentsRef(comment.id)}
				delete={props.delete}
				key={comment.id}
				comment={comment}
				commentsAPI={props.commentsAPI}
				toggleReplyBox={props.toggleReplyBox}
			/>
		))}
	</InfiniteScroll>
));

CommentList.defaultProps = {
	loadMore() { }, // Replies don't have load more
	infinite: false,
};

export default CommentList;
