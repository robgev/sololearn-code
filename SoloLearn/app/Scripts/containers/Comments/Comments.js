// React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import {
	getCommentsInternal, emptyComments,
	voteCommentInternal, emptyCommentReplies,
	editCommentInternal,
} from '../../actions/comments';

// Additional components
import Comment from './Comment';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

// Utils
import getStyles from '../../utils/styleConverter';

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

class Comments extends Component {
        state = {
        	isLoading: false,
        	fullyLoaded: false,
					latestLoadingComment: 0,
        }

    loadComments = (parentId) => {
    	const {
    		id, type, commentsType, ordering, comments,
    	} = this.props;
    	let count = 20;
    	let index = comments ? comments.length - comments.filter(c => c.isForcedDown).length : 0;

    	this.setState({ isLoading: true });

    	if (parentId) {
    		const commentIndex = comments.findIndex(c => c.id == parentId);
    		const activeComment = comments[commentIndex];

    		count = 10;
    		index = activeComment.replies.length > 0 ? activeComment.replies.length - activeComment.replies.filter(c => c.isForcedDown).length : 0;
    	}

    	this.props.getComments(id, !type ? null : type, parentId, index, ordering, commentsType, count).then((count) => {
    		if (!parentId && count < 20) this.setState({ fullyLoaded: true });

    		this.setState({ isLoading: false });
    	}).catch((error) => {
    		console.log(error);
    	});
    }

    // Load comment replies
    loadReplies = (commentId, type) => {
    	const comments = this.props.comments;
    	const index = comments.findIndex(c => c.id == commentId);
    	const activeComment = comments[index];
    	const loadedReplies = activeComment.replies;
			this.setState({ latestLoadingComment: commentId })
    	if (type == 'openReplies' && activeComment.replies.length > 0) {
    		this.props.emptyCommentReplies(commentId);
    	} else {
    		this.loadComments(commentId);
    	}
    }

    // Load comments when condition changes
    loadCommentsByState = () => {
    	this.props.emptyComments().then(() => {
    		this.loadComments();
    	}).catch((error) => {
    		console.log(error);
    	});
    }

    // Check scroll state
    handleScroll = (scrollableArea) => {
    	if ((scrollableArea.scrollTop === (scrollableArea.scrollHeight - scrollableArea.offsetHeight)) && !this.state.isLoading && !this.state.fullyLoaded) {
    		this.loadComments();
    	}
    }

    voteComment = (comment, voteValue) => {
    	this.props.voteCommentInternal(comment, voteValue, this.props.commentsType);
    }

    editComment = (comment, message) => {
    	this.props.editCommentInternal(comment.id, comment.parentID, message, this.props.commentsType).then(() => {
    		this.props.cancelAll();
    	});
    }

    render() {
    	const { comments, isLoaded } = this.props;
			const { isLoading, latestLoadingComment } = this.state;
    	return (
	<div id="comments">
    			{(!isLoaded || comments.length == 0) && !this.state.fullyLoaded && <LoadingOverlay />}
    			{(isLoaded && comments.length > 0) && this.props.comments.map((comment, index) => (
							<Comment
							key={comment.id}
							comment={comment}
							isEditing={this.props.isEditing}
							isReplying={this.state.isReplying}
							activeComment={this.props.activeComment}
							openEdit={this.props.openEdit}
							cancelAll={this.props.cancelAll}
							openReplyBoxToolbar={this.props.openReplyBoxToolbar}
							voteComment={this.voteComment}
							editComment={this.editComment}
							deleteComment={this.props.deleteComment}
							loadReplies={this.loadReplies}
							isLoadingReplies={isLoading && latestLoadingComment === comment.id}
						/>
		    	))}
    			{
    				(comments.length > 0 && !this.state.fullyLoaded) &&
						<div className="loading" style={!this.state.isLoading ? styles.bottomLoading.base : [ styles.bottomLoading.base, styles.bottomLoading.active ]}>
							<LoadingOverlay size={30} />
						</div>
    			}
    			{(this.state.fullyLoaded && comments.length == 0) && <div style={styles.noResults}>No Results Found</div>}
    		</div>
    	);
    }

    componentWillMount() {
    	this.loadComments();
    }

    componentDidMount() {
    	const container = document.getElementById('comments');
    	const scrollableArea = container.parentNode;
    	scrollableArea.addEventListener('scroll', () => this.handleScroll(scrollableArea));
    }

    componentWillUnmount() {
    	this.props.emptyComments();

    	const container = document.getElementById('comments');
    	const scrollableArea = container.parentNode;
    	scrollableArea.removeEventListener('scroll', this.handleScroll);
    }
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getComments: getCommentsInternal,
		emptyComments,
		emptyCommentReplies,
		voteCommentInternal,
		editCommentInternal,
	}, dispatch);
}

export default connect(() => ({}), mapDispatchToProps, null, { withRef: true })(Radium(Comments));
