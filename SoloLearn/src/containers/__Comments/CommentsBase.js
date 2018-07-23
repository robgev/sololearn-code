// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// Material UI components
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';
import { Toolbar, ToolbarGroup, ToolbarTitle } from 'material-ui/Toolbar';

// Redux modules
import { isLoaded } from 'reducers';
import { addCommentInternal, deleteCommentInternal } from 'actions/comments';
import { getComments } from 'selectors';

// Popups
import Popup from 'api/popupService';

// Additional components
import ReplyBox from './ReplyBox';
import Comments from './Comments';

// Styles
import { CommentsBaseStyle as styles } from './styles';

const mapStateToProps = state => ({
	areCommentsLoaded: isLoaded(state, 'comments'),
	profile: state.userProfile,
	comments: getComments(state),
});

const mapDispatchToProps = {
	addCommentInternal,
	deleteCommentInternal,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class CommentsBase extends Component {
	constructor(props) {
		super(props);
		this.state = {
			ordering: 2,
			isEditing: false,
			isReplying: false,
			isDeleting: false,
			activeComment: {
				id: null,
				parentId: null,
				userName: null,
			},
		};
	}

	// Cancel all active actions
	partialCancel = (partialState, callback) =>
		this.setState({
			isEditing: false,
			isReplying: false,
			isDeleting: false,
			activeComment: {
				id: null,
				parentId: null,
				userName: null,
			},
			...partialState,
		}, callback);

	// Open comment editing area
	openEdit = (id, parentId, userName, cb) => {
		this.partialCancel({
			isEditing: true,
			activeComment: {
				id,
				parentId,
				userName,
			},
		}, () => {
			this._comments.getWrappedInstance().recompute();
			this._comments.getWrappedInstance()._forceUpdate();
			cb();
		});
	}

	cancelAll = () => {
		this.partialCancel(null, () => {
			this._comments.getWrappedInstance().recompute();
			this._comments.getWrappedInstance()._forceUpdate();
		});
	}

	// Open reply box toolbar (ex: replies to James Flanders)
	openReplyBoxToolbar = async (id, parentId, userName) => {
		if (this.state.activeComment.id === id && this.state.isReplying) return;
		this.focusOnReply();
		this.partialCancel({
			isReplying: true,
			activeComment: {
				id,
				parentId,
				userName,
			},
		});
	}

	// Render popup heading
	deleteComment = async () => {
		const { id, parentId } = this.state.activeComment;
		await this.props.deleteCommentInternal(id, parentId, this.props.commentsType);
		this.partialCancel();
	}

	// Open deleting confirmation popup
	handleDeleteDialogOpen = (comment) => {
		this.setState({
			isDeleting: true,
			activeComment: {
				id: comment.id,
				parentId: comment.parentID,
			},
		});
	}

	focusOnReply = () => { this.input.getWrappedInstance().focus(); }

	updateComments = () => this._comments.getWrappedInstance().loadCommentsByState();

	closeReplies = () => {
		const { index } = this.props.comments[0];
		if (index === -1) this.updateComments();
	}

	// Change ordering state
	handleFilterChange = (event, index, value) => {
		if (value === this.state.ordering) return;
		this.partialCancel();
		this.setState({ ordering: value });
		this.updateComments();
	}

	addComment = async (message) => {
		const { activeComment, ordering } = this.state;
		const {
			id, type, commentsType, addCommentInternal,
		} = this.props;
		const parentId = activeComment.parentId == null ? activeComment.id : activeComment.parentId;
		const newComment = await addCommentInternal({
			id, parentId, message, type, commentsType, ordering,
		});
		this.partialCancel();
		this._comments.getWrappedInstance().recompute();
		this._comments.getWrappedInstance()._forceUpdate();
		this._comments.getWrappedInstance()._scrollTo(newComment.id);
	}

	// Render popup heading
	getPopupTitle = () => {
		const { t, commentsCount } = this.props;
		return (
			<div style={styles.commentsFilterWrapper}>
				<Toolbar style={styles.commentsFilter.base}>
					<ToolbarTitle
						onClick={this.closeReplies}
						text={commentsCount === 1 ?
							t('common.comment-format-one') :
							`${commentsCount} ${t('common.comments')}`
						}
						style={styles.commentsFilter.title}
					/>
					<ToolbarGroup lastChild>
						<DropDownMenu
							style={styles.filterDropDown.base}
							value={this.state.ordering}
							onChange={this.handleFilterChange}
							autoWidth={false}
						>
							<MenuItem style={styles.filterDropDown.item} value={2} primaryText={t('comments.filter.most-popular')} />
							<MenuItem style={styles.filterDropDown.item} value={1} primaryText={t('comments.filter.most-recent')} />
						</DropDownMenu>
					</ToolbarGroup>
				</Toolbar>
			</div>
		);
	}

	render() {
		const {
			id, type, commentsType, comments, profile, areCommentsLoaded, t,
		} = this.props;

		const deleteActions = [
			{
				componentType: FlatButton,
				label: 'popupCancel',
				primary: false,
				actionCallback: this.partialCancel,
			},
			{
				componentType: FlatButton,
				label: 'popupDelete',
				primary: false,
				actionCallback: this.deleteComment,
			},
		];

		return (
			<div>
				{this.getPopupTitle()}
				<ReplyBox
					ref={(input) => { this.input = input; }}
					profile={profile}
					userName={this.state.activeComment.userName}
					isReplying={this.state.isReplying}
					closeToolbar={this.partialCancel}
					save={this.addComment}
					commentType={commentsType}
					id={id}
				/>
				<Comments
					t={t}
					id={id}
					type={type}
					commentsType={commentsType}
					comments={comments}
					isEditing={this.state.isEditing}
					isReplying={this.state.isReplying}
					activeComment={this.state.activeComment}
					isLoaded={areCommentsLoaded}
					ordering={this.state.ordering}
					openEdit={this.openEdit}
					cancelAll={this.cancelAll}
					openReplyBoxToolbar={this.openReplyBoxToolbar}
					deleteComment={this.handleDeleteDialogOpen}
					selectedComment={this.state.selectedComment}
					ref={(_comments) => { this._comments = _comments; }}
				/>
				{this.state.isDeleting &&
					Popup.getPopup(
						Popup.generatePopupActions(deleteActions),
						this.state.isDeleting,
						this.handleDeleteDialogClose,
						[ { key: 'commentDeleteConfirmText', replacemant: '' } ],
					)}
			</div>
		);
	}
}

export default CommentsBase;
