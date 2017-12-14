// General modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import {
	CellMeasurerCache,
} from 'react-virtualized';
import { find } from 'lodash';

// Redux modules
import {
	getCommentsInternal, emptyComments,
	voteCommentInternal, emptyCommentReplies,
	editCommentInternal, setSelectedComment,
} from 'actions/comments';
import { getSelectedCommentId } from 'selectors';
import { lastNonForcedDownIndex } from 'utils/comments.utils';

// Additional components
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import Comment from './Comment';

// Styles
import { CommentsStyle as styles } from './styles';

export const loadRepliesTypes = {
	LOAD_REPLIES: 'LOAD_REPLIES',
	CLOSE_REPLIES: 'CLOSE_REPLIES',
};

const getNewCache = () => new CellMeasurerCache({
	defaultWidth: 1000,
	minWidth: 75,
	fixedWidth: true,
	defaultHeight: 110,
});

const mapStateToProps = state => ({
	selectedComment: getSelectedCommentId(state),
});

const mapDispatchToProps = {
	getComments: getCommentsInternal,
	emptyComments,
	emptyCommentReplies,
	voteCommentInternal,
	editCommentInternal,
	setSelectedComment,
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
@Radium
class Comments extends Component {
	state = {
		isLoading: false,
		latestLoadingComment: 0,
		cache: getNewCache(),
	};

	componentWillMount() {
		this.loadComments();
	}

	componentWillUnmount() {
		this.props.setSelectedComment(null);
		this.props.emptyComments();
	}

	loadComments = async (parentId = null) => {
		const {
			id, type, commentsType, ordering: orderby, comments, selectedComment: findPostId,
		} = this.props;
		// console.warn(orderby, comments);
		const count = parentId ? 10 : 20;
		let index = 0;
		if (parentId) {
			const replies = comments.find(comment => comment.id === parentId).repliesArray;
			index = lastNonForcedDownIndex(replies) + 1;
		} else {
			index = lastNonForcedDownIndex(comments) + 1;
		}
		this.setState({ isLoading: true });
		await this.props.getComments({
			id, type, parentId, index, orderby, commentsType, count, findPostId,
		});
		this.setState({ isLoading: false });
	}

	// Load comment replies
	loadReplies = async (commentId, type) => {
		this.setState({ latestLoadingComment: commentId });
		if (type === loadRepliesTypes.CLOSE_REPLIES) {
			await this.props.emptyCommentReplies(commentId);
		} else if (type === loadRepliesTypes.LOAD_REPLIES) {
			await this.loadComments(commentId);
		}
		this.setState({ cache: getNewCache() });
	}

	// Load comments when condition changes
	loadCommentsByState = async () => {
		await this.props.emptyComments();
		await this.loadComments();
		this.setState({ cache: getNewCache() });
	}

	voteComment = async (comment, voteValue) => {
		await this.props.voteCommentInternal(comment, voteValue, this.props.commentsType);
		console.log(comment, voteComment);
		this._list._forceUpdate();
	}

	editComment = async ({ id, parentId }, message) => {
		await this.props.editCommentInternal(id, parentId, message, this.props.commentsType);
		this.props.cancelAll();
	}

	renderComment = (comment) => {
		const {
			props: {
				isEditing,
				activeComment,
				openEdit,
				cancelAll,
				openReplyBoxToolbar,
				deleteComment,
				commentsType,
			},
			state: { isReplying, isLoading, latestLoadingComment },
			voteComment, editComment, loadReplies,
		} = this;
		return (
			<Comment
				key={comment.id}
				comment={comment}
				commentType={commentsType}
				isEditing={isEditing}
				isReplying={isReplying}
				activeComment={activeComment}
				openEdit={openEdit}
				cancelAll={cancelAll}
				openReplyBoxToolbar={openReplyBoxToolbar}
				voteComment={voteComment}
				editComment={editComment}
				deleteComment={deleteComment}
				loadReplies={loadReplies}
				isLoadingReplies={isLoading && latestLoadingComment === comment.id}
			/>
		);
	}

	render() {
		const { comments, isLoaded, selectedComment } = this.props;
		return (
			<div id="comments" style={{ maxHeight: 660, height: '100%' }}>
				{(!isLoaded || !comments.length) && <LoadingOverlay />}
				<div style={{ height: '100%' }}>
					<InfiniteVirtualizedList
						item={this.renderComment}
						list={comments}
						loadMore={this.loadComments}
						cache={this.state.cache}
						condition={selectedComment}
						ref={(list) => { this._list = list; }}
					/>
				</div>
				{
					!!comments.length && (
						<div
							style={!this.state.isLoading ?
								styles.bottomLoading.base :
								[ styles.bottomLoading.base, styles.bottomLoading.active ]}
						>
							<LoadingOverlay size={30} />
						</div>
					)
				}
			</div>
		);
	}
}

export default Comments;
