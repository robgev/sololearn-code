// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Material UI components
import { TextField, IconMenu, MenuItem, FlatButton, IconButton } from 'material-ui';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import getLikes from 'actions/likes';

// Utils
import Likes from 'components/Shared/Likes';
import { updateDate, updateMessage } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import { loadRepliesTypes } from './Comments';

// Style
import { CommentStyle as styles } from './styles';

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	getLikes,
};

@connect(mapStateToProps, mapDispatchToProps)
class Comment extends Component {
	state = {
		errorText: '',
		textFieldValue: this.props.comment.message,
	}

	onChange = (e) => {
		if (e.target.value.length === 0) {
			this.setState({
				textFieldValue: e.target.value,
				errorText: 'This field is required',
			});
		} else {
			this.setState({
				textFieldValue: e.target.value,
				errorText: '',
			});
		}
	}

	setReplies = ({ more = false }) => {
		// don't remove the object, because then the funciton will get DOM values by default in 'more'
		const { comment } = this.props;
		const willLoadReplies = more || (comment.repliesArray && comment.repliesArray.length === 0);
		const type = willLoadReplies ? loadRepliesTypes.LOAD_REPLIES : loadRepliesTypes.CLOSE_REPLIES;
		this.props.loadReplies(comment.parentId || comment.id, type);
		this.setState({ hasLoadedReplies: willLoadReplies });
	}

	loadMoreReplies = () => this.setReplies({ more: true });

	getPrimaryControls = (comment) => {
		const isReply = comment.parentID != null;
		const hasReplies = !!comment.replies;

		return (
			<div style={styles.commentControls.right}>
				{!isReply &&
					<FlatButton
						label={comment.replies + (comment.replies === 1 ? ' Reply' : ' Replies')}
						primary={hasReplies}
						disabled={!hasReplies}
						onClick={this.setReplies}
					/>}
				<FlatButton
					label="Reply"
					primary
					onClick={() =>
						this.props.openReplyBoxToolbar(comment.id, comment.parentID, comment.userName, isReply)}
				/>
			</div>
		);
	}

	openEdit = () => {
		const { comment } = this.props;
		this.props.openEdit(comment.id, comment.parentID, comment.userName);
	}

	closeEdit = () => {
		this.props.cancelAll();
		this.setState({
			errorText: '',
			textFieldValue: this.props.comment.message,
		});
	}

	getLikes = () => {
		const { getLikes, comment, commentType } = this.props;
		getLikes(commentType === 'lesson' ? 3 : 4, comment.id);
	}

	getEditControls = () => {
		const saveDisabled = this.state.errorText.length === 0;

		return (
			<div className="edit-controls" style={styles.commentControls.right}>
				<FlatButton
					label="Cancel"
					onClick={this.closeEdit}
				/>
				<FlatButton
					label="Save"
					primary={saveDisabled}
					disabled={!saveDisabled}
					onClick={() => { this.props.editComment(this.props.comment, this.state.textFieldValue); }}
				/>
			</div>
		);
	}

	getMenuControls = comment => (
		<IconMenu
			iconButtonElement={<IconButton style={styles.iconMenu.icon}><MoreVertIcon /></IconButton>}
			anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
			targetOrigin={{ horizontal: 'right', vertical: 'top' }}
		>
			{
				comment.userID === this.props.userId ?
					[
						<MenuItem
							primaryText="Edit"
							key={`edit${comment.id}`}
							onClick={this.openEdit}
						/>,
						<MenuItem
							primaryText="Delete"
							key={`remove${comment.id}`}
							onClick={() => { this.props.deleteComment(comment); }}
						/>,
					]
					:
					<MenuItem
						primaryText="Report"
						key={`report${comment.id}`}
					/>
			}
		</IconMenu>
	)

	getVoteControls = comment => (
		<div className="vote-controls" style={styles.commentControls.left}>
			<IconButton
				style={styles.vote.button.base}
				iconStyle={styles.vote.button.icon}
				onClick={() => this.props.voteComment(comment, 1)}
			>
				<ThumbUp color={comment.vote === 1 ? blueGrey500 : grey500} />
			</IconButton>
			<Likes votes={comment.votes} getLikes={this.getLikes} />
			<IconButton
				style={styles.vote.button.base}
				iconStyle={styles.vote.button.icon}
				onClick={() => this.props.voteComment(comment, -1)}
			>
				<ThumbDown color={comment.vote === -1 ? blueGrey500 : grey500} />
			</IconButton>
		</div>
	)

	getEditableArea = (comment) => {
		const isEditing = (this.props.isEditing && this.props.activeComment.id === comment.id);

		return (
			<div style={styles.commentContent}>
				{!isEditing &&
					<div
						dangerouslySetInnerHTML={{ __html: updateMessage(this.state.textFieldValue) }}
						style={styles.commentMessage}
					/>}
				{isEditing &&
					[
						<TextField
							key={`commentTextField${comment.id}`}
							hintText="Message"
							multiLine
							maxLength="2048"
							rowsMax={4}
							fullWidth
							defaultValue={this.state.textFieldValue}
							errorText={this.state.errorText}
							onChange={e => this.onChange(e)}
							style={styles.textField}
						/>,
						<span style={styles.textFieldCoutner} key={`commentCounter${comment.id}`}>{2048 - this.state.textFieldValue.length} characters remaining</span>,
					]
				}
			</div>
		);
	}

	render() {
		if (this.props.comment.type === 'LOAD_MORE') {
			return <FlatButton label="Load More" onClick={this.loadMoreReplies} />;
		}
		const {
			comment,
			comment: {
				id,
				date,
				userID,
				parentID,
				avatarUrl,
				userName,
			},
			activeComment,
		} = this.props;
		const isReply = parentID != null;
		const isEditing = (this.props.isEditing && activeComment.id === id);

		return (
			<div style={{ ...styles.commentContainer.base, marginLeft: isReply ? 20 : 0 }}>
				<div style={styles.comment.base}>
					<div style={styles.commentConent}>
						<ProfileAvatar
							size={40}
							userID={userID}
							userName={userName}
							avatarUrl={avatarUrl}
						/>
						<div
							style={{
								...styles.commentDetailsWrapper.base,
								...(isEditing ? styles.commentDetailsWrapper.editing : {}),
							}}
						>
							<div style={styles.commentDetails}>
								<div style={styles.heading}>
									<Link to={`/profile/${userID}`} style={styles.noStyle}>
										<span style={styles.userName}>{userName}</span>
									</Link>
									<div style={styles.heading}>
										<p style={styles.commentDate}>{updateDate(date)}</p>
										{!isEditing && this.getMenuControls(comment)}
									</div>
								</div>
								{this.getEditableArea(comment)}
							</div>
							<div style={styles.commentControls.base}>
								{!isEditing && this.getVoteControls(comment)}
								{isEditing && this.getEditControls()}
								{!isEditing && this.getPrimaryControls(comment)}
							</div>
						</div>
					</div>
				</div>
			</div>
		);
	}
}

export default Comment;
