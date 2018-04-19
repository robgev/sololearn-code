// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

// Material UI components
import Dialog from 'material-ui/Dialog';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { grey600 } from 'material-ui/styles/colors';
import Close from 'material-ui/svg-icons/content/clear';
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
			replyText: '',
			activeComment: {
				id: null,
				parentId: null,
				userName: '',
				previousId: null, // REFACTOR THIS SHIT
				previousParentId: null, // REFACTOR THIS SHIT
			},
		};
	}

	// Cancel all active actions
	partialCancel = (partialState, callback) =>
		this.setState({
			isEditing: false,
			isReplying: false,
			isDeleting: false,
			replyText: '',
			activeComment: {
				id: null,
				parentId: null,
				userName: '',
				previousId: this.state.activeComment.id,
				previousParentId: this.state.activeComment.parentId,
			},
			...partialState,
		}, callback);

	// Open comment editing area
	openEdit = (id, parentId, userName) => {
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
			replyText: `@${userName}`,
			activeComment: {
				id,
				parentId,
				userName,
			},
		});
	}

	setReplyText = replyText => this.setState({ replyText })

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

	focusOnReply = () => { this._input.focus(); }

	isReplyDisabled = () =>
		this.state.replyText === '' || this.state.replyText === `@${this.state.userName}`

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

	addComment = async () => {
		const { replyText: message } = this.state;
		this.setReplyText('');
		const { activeComment, ordering } = this.state;
		const {
			id, type, commentsType, addCommentInternal,
		} = this.props;
		const parentId = activeComment.parentId == null ? activeComment.id : activeComment.parentId;
		await addCommentInternal({
			id, parentId, message, type, commentsType, ordering,
		});
		this.partialCancel();
		this._comments.getWrappedInstance().recompute();
		this._comments.getWrappedInstance()._forceUpdate();
	}

	// Render popup heading
	getPopupTitle = () => {
		const { t } = this.props;
		return (
			<div style={styles.commentsFilterWrapper}>
				<Toolbar style={styles.commentsFilter.base}>
					<ToolbarTitle onClick={this.closeReplies} text={t('common.comments')} style={styles.commentsFilter.title} />
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
						<IconButton
							iconStyle={styles.close.icon.big}
							onClick={this.props.closeComments}
							style={{ ...styles.close.button.comments, ...styles.close.button.big }}
						>
							<Close color={grey600} />
						</IconButton>
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
				<ReplyBox
					inputRef={(input) => { this._input = input; }}
					profile={profile}
					isPrimary={!this.state.isReplying}
					replyText={this.state.replyText}
					setReplyText={this.setReplyText}
					userName={this.state.activeComment.userName}
					closeToolbar={this.partialCancel}
					reply={this.addComment}
					disabled={this.isReplyDisabled()}
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
