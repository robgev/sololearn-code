import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { InfiniteScroll } from 'components/molecules'
import Comment from './Comment';

import './CommentList.scss';

const CommentList = observer(props => (
	<Fragment
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
	</Fragment>
));

export default CommentList;
