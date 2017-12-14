// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';

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
				userName: '',
				previousId: null, // REFACTOR THIS SHIT
				previousParentId: null, // REFACTOR THIS SHIT
			},
		};
	}

	// Cancel all active actions
	partialCancel = partialState =>
		this.setState({
			isEditing: false,
			isReplying: false,
			isDeleting: false,
			activeComment: {
				id: null,
				parentId: null,
				userName: '',
				previousId: this.state.activeComment.id,
				previousParentId: this.state.activeComment.parentId,
			},
			...partialState,
		})

	// Open comment editing area
	openEdit = async (id, parentId, userName) => {
		this.partialCancel({
			isEditing: true,
			activeComment: {
				id,
				parentId,
				userName,
			},
		});
	}

	// Open reply box toolbar (ex: replies to James Flanders)
	openReplyBoxToolbar = async (id, parentId, userName) => {
		if (this.state.activeComment.id === id && this.state.isReplying) return;
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

	// Change ordering state
	handleFilterChange = (event, index, value) => {
		if (value === this.state.ordering) return;
		this.partialCancel();
		this.setState({ ordering: value });
		this._comments.getWrappedInstance().loadCommentsByState();
	}

	addComment = async (message) => {
		const { activeComment, ordering } = this.state;
		const { id, type, commentsType } = this.props;
		const parentId = activeComment.parentId == null ? activeComment.id : activeComment.parentId;
		await this.props.addCommentInternal({
			id, parentId, message, type, commentsType, ordering,
		});
		this.partialCancel();
	}

	// Render popup heading
	getPopupTitle = () => (
		<div style={styles.commentsFilterWrapper}>
			<Toolbar style={styles.commentsFilter.base}>
				<ToolbarTitle text="COMMENTS" style={styles.commentsFilter.title} />
				<ToolbarGroup lastChild>
					<DropDownMenu
						style={styles.filterDropDown.base}
						value={this.state.ordering}
						onChange={this.handleFilterChange}
						autoWidth={false}
					>
						<MenuItem style={styles.filterDropDown.item} value={2} primaryText="Most Popular" />
						<MenuItem style={styles.filterDropDown.item} value={1} primaryText="Most Recent" />
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
	)

	render() {
		const {
			id, type, commentsType, comments, profile, areCommentsLoaded,
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
				<Dialog
					modal={false}
					open={this.props.commentsOpened}
					title={this.getPopupTitle()}
					autoScrollBodyContent
					actions={
						<ReplyBox
							profile={profile}
							isPrimary={!this.state.isReplying}
							defaultText={this.state.isReplying ? `@${this.state.activeComment.userName} ` : ''}
							userName={this.state.activeComment.userName}
							closeToolbar={this.partialCancel}
							reply={this.addComment}
						/>
					}
					actionsContainerStyle={styles.replyBoxWrapper}
					bodyStyle={styles.dialogBody}
					onRequestClose={this.props.closeComments}
				>
					<Comments
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
						cancelAll={this.partialCancel}
						openReplyBoxToolbar={this.openReplyBoxToolbar}
						deleteComment={this.handleDeleteDialogOpen}
						selectedComment={this.state.selectedComment}
						ref={(_comments) => { this._comments = _comments; }}
					/>
				</Dialog>
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
