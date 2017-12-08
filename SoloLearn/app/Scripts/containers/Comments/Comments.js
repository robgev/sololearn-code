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
} from 'actions/comments';

// Additional components
import Comment from './Comment';
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import { repliesOfId } from 'utils';

const styles = {
	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			height: '50px',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},

		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},

	noResults: {
		position: 'absolute',
		top: '50%',
		left: '50%',
		transform: 'translate(-50%,-50%)',
		fontSize: '20px',
		color: '#777',
	},
};

const getNewCache = () => new CellMeasurerCache({
	defaultWidth: 1000,
	minWidth: 75,
	fixedWidth: true,
	defaultHeight: 110,
});

const mapStateToProps = ({ selectedComment }) => ({
	selectedComment,
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
		console.warn('Unmounted for no reason');
		this.props.setSelectedComment(null);
		this.props.emptyComments();
	}

	loadComments = async (parentId = null) => {
		const {
			id, type, commentsType, ordering: orderby, comments, selectedComment: findPostId,
		} = this.props;
		const count = parentId ? 10 : 20;
		console.warn(comments.length);
		let index = comments.length ? comments[comments.length - 1].index + 1 : 0;
		if (parentId) {
			const replies = repliesOfId(comments, parentId);
			index = replies.length ? replies[replies.length - 1].index + 1 : 0;
		}
		this.setState({ isLoading: true });
		await this.props.getComments({
			id, type, parentId, index, orderby, commentsType, count, findPostId,
		});
		this.setState({ isLoading: false });
	}

	// Load comment replies
	loadReplies = async (commentId, type) => {
		const { comments } = this.props;
		this.setState({ latestLoadingComment: commentId });
		if (type === 'openReplies' && repliesOfId(comments, commentId).length) {
			await this.props.emptyCommentReplies(commentId);
		} else {
			await this.loadComments(commentId);
		}
		this.setState({ cache: getNewCache() });
	}

	// Load comments when condition changes
	loadCommentsByState = async () => {
		this.props.emptyComments();
		await this.loadComments();
		this.setState({ cache: getNewCache() });
	}

	voteComment = async (comment, voteValue) => {
		await this.props.voteCommentInternal(comment, voteValue, this.props.commentsType);
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
