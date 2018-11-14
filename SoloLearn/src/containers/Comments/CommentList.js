import React from 'react';
import { observer } from 'mobx-react';
import { InfiniteScroll } from 'components/molecules'
import Comment from './Comment';

import './CommentList.scss';

const CommentList = observer(props => (
	<InfiniteScroll
		loadMore={props.loadMore}
		hasMore={props.infinite && props.hasMore}
		isLoading={props.loading}
		className="comment-list"
	>
		{props.comments.map(comment => (
			<Comment
				onCommentAdd={props.onCommentAdd}
				onCommentDelete={props.onCommentDelete}
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
