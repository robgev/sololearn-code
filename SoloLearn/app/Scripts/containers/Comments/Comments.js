// General modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import {
	CellMeasurerCache,
} from 'react-virtualized';

// Redux modules
import {
	getCommentsInternal, emptyComments,
	voteCommentInternal, emptyCommentReplies,
	editCommentInternal, setSelectedComment,
	getCommentsAboveInternal,
} from 'actions/comments';
import { getSelectedCommentId } from 'selectors';
import { lastNonForcedDownIndex, notForcedDownCount } from 'utils/comments.utils';

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

const cache = () => new CellMeasurerCache({
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
	getCommentsAbove: getCommentsAboveInternal,
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
@Radium
class Comments extends Component {
	state = {
		isLoading: false,
		latestLoadingComment: 0,
		cache: cache(),
	};

	componentDidMount() {
		this.loadComments();
	}

	componentWillUnmount() {
		this.props.emptyComments();
	}

	recompute = (index) => { this._list.recomputeRowHeights(index); }
	_forceUpdate = () => { this._list._forceUpdate(); }

	loadCommentsAbove = async (parentId = null) => {
		const {
			id, type, commentsType, ordering: orderby, comments,
		} = this.props;
		let index = 0;
		let count = 0;
		if (parentId) {
			index = comments.find(c => !!c.index && c.index > 0).index - 10;
			count = index < 0 ? -index : 10;
		} else {
			index = comments.find(c => !!c.index).index - 20;
			count = index < 0 ? -index : 20;
		}
		index = index < 0 ? 0 : index;
		this.setState({ isLoading: true });
		await this.props.getCommentsAbove({
			id, type, commentsType, orderby, parentId, index, count,
		});
		this.setState({ isLoading: false });
		this.recompute();
	}

	loadComments = async (parentId = null) => {
		const {
			id, type, commentsType, ordering: orderby, comments, selectedComment: findPostId,
		} = this.props;
		if (findPostId != null) this.props.setSelectedComment(null);
		const count = parentId ? 10 : 20;
		let index = 0;
		if (parentId) {
			const replies = comments.find(comment => comment.id === parentId).repliesArray;
			index = lastNonForcedDownIndex(replies) + 1;
		} else {
			index = lastNonForcedDownIndex(comments) + 1;
		}
		console.log(index);
		if (index === -1 || (comments.length > 0 && comments[0].index === -1)) {
			this._list._markFull();
			return;
		}
		this.setState({ isLoading: true });
		await this.props.getComments({
			id, type, parentId, index, orderby, commentsType, count, findPostId,
		});
		this.setState({ isLoading: false });
		if (!parentId) {
			this.recompute(notForcedDownCount(comments));
		}
		if (findPostId != null) this._list._scrollTo(findPostId);
	}

	// Load comment replies
	loadReplies = async (commentId, type) => {
		const index = this.props.comments.findIndex(c => c.id === commentId);
		this.setState({ latestLoadingComment: commentId });
		if (type === loadRepliesTypes.CLOSE_REPLIES) {
			await this.props.emptyCommentReplies(commentId);
		} else if (type === loadRepliesTypes.LOAD_REPLIES) {
			await this.loadComments(commentId);
		}
		this.recompute(index);
	}

	// Load comments when condition changes
	loadCommentsByState = async () => {
		await this.props.emptyComments();
		await this.loadComments();
		this.recompute();
	}

	voteComment = async (comment, voteValue) => {
		await this.props.voteCommentInternal(comment, voteValue, this.props.commentsType);
		this._forceUpdate();
	}

	deleteComment = async (comment) => {
		// const index = this.props.comments.findIndex(c => c.id === comment.id);
		await this.props.deleteComment(comment);
		this.recompute();
		this._forceUpdate();
	}

	editComment = async ({ id, parentId }, message) => {
		const index = this.props.comments.findIndex(c => c.id === id);
		await this.props.editCommentInternal(id, parentId, message, this.props.commentsType);
		this.props.cancelAll();
		this.recompute(index);
	}

	renderComment = (comment) => {
		const {
			props: {
				isEditing,
				activeComment,
				openEdit,
				cancelAll,
				openReplyBoxToolbar,
				commentsType,
			},
			state: { isReplying, isLoading, latestLoadingComment },
			voteComment, editComment, loadReplies, loadCommentsAbove, deleteComment,
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
				loadCommentsAbove={loadCommentsAbove}
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
