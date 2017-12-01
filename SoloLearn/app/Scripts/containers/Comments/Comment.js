// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';

// Material UI components
import TextField from 'material-ui/TextField';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

// Redux modules
import getLikesInternal from 'actions/likes';

// Utils
import Likes from 'components/Shared/Likes';
import { updateDate, updateMessage } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

const styles = {
	commentContainer: {
		base: {
			position: 'relative',
		},

		elevated: {
			boxShadow: '0 5px 3px rgba(0,0,0,.12), 0 1px 10px rgba(0,0,0,.24)',
			zIndex: 1000,
		},
	},

	comment: {
		base: {
			position: 'relative',
			backgroundColor: '#fff',
			borderRadius: 0,
			borderLeftStyle: 'solid',
			borderLeftWidth: '3px',
			borderLeftColor: '#fff',
			borderBottomStyle: 'solid',
			borderBottomWidth: '1px',
			borderBottomColor: '#fafafa',
			borderTopStyle: 'solid',
			borderTopWidth: '1px',
			borderTopColor: '#fafafa',
			transition: 'opacity ease 400ms, transform ease 400ms, -webkit-transform ease 400ms',
			boxShadow: 'rgba(0, 0, 0, 0.156863) 0px 3px 6px, rgba(0, 0, 0, 0.227451) 0px 3px 6px',
		},

		elevated: {
			position: 'relative',
			boxShadow: '0 5px 3px rgba(0,0,0,.12), 0 1px 10px rgba(0,0,0,.24)',
			zIndex: 1000,
		},
	},

	commentConent: {
		display: 'flex',
		padding: '10px',
	},

	commentDetailsWrapper: {
		base: {
			flex: 1,
			position: 'relative',
			overflow: 'hidden',
			padding: '0 0 0 10px',
		},

		editing: {
			padding: '0 0 10px 10px',
		},
	},

	commentDetails: {
		position: 'relative',
	},

	heading: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
	},

	iconMenu: {
		icon: {
			width: 'inherit',
			height: 'inherit',
			padding: 0,
		},
	},

	userName: {
		fontSize: '14px',
		color: '#636060',
		margin: '0px 0px 5px 0px',
	},

	commentDate: {
		fontSize: '12px',
		color: '#777',
	},

	commentMessage: {
		fontSize: '13px',
		color: '#827e7e',
		margin: '3px 0px 5px',
		whiteSpace: 'pre-line',
	},

	commentControls: {
		base: {
			display: 'flex',
			justifyContent: 'space-between',
			margin: '8px 0 0 0',
			overflow: 'hidden',
		},

		left: {
			display: 'flex',
			alignItems: 'center',
		},

		right: {
			display: 'flex',
			alignItems: 'center',
		},
	},

	replies: {
		base: {
			backgroundColor: '#dedede',
			zIndex: 999,
		},

		content: {
			margin: '0 0 0 15px',
		},
	},

	commentsGap: {
		minHeight: '20px',
		textAlign: 'center',
	},

	vote: {
		button: {
			base: {
				verticalAlign: 'middle',
				width: '32px',
				height: '32px',
				padding: '8px',
			},

			icon: {
				width: '16px',
				height: '16px',
			},
		},

		text: {
			display: 'inline-block',
			verticalAlign: 'middle',
			minWidth: '23px',
			textAlign: 'center',
			fontWeight: '500',
			fontSize: '15px',
		},
	},

	textField: {
		margin: '0 0 10px 0',
		fontSize: '13px',
	},

	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		fontWeight: '500',
	},

	deleteButton: {
		color: '#E53935',
	},

	noStyle: {
		textDecoration: 'none',
	},
};

class Comment extends Component {
	constructor(props) {
		super(props);
		this.state = {
			errorText: '',
			textFieldValue: this.props.comment.message,
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (((this.props.comment.id === nextProps.activeComment.id ||
			this.props.comment.id === nextProps.activeComment.parentId) ||
			(this.props.comment.id === nextProps.activeComment.previousId ||
				this.props.comment.id === nextProps.activeComment.previousParentId) &&
			(this.props.isEditing !== nextProps.isEditing ||
				this.props.isReplying !== nextProps.isReplying)) ||
			this.props.comment.vote !== nextProps.comment.vote ||
			this.state.errorText !== nextState.errorText ||
			this.state.textFieldValue !== nextState.textFieldValue ||
			this.props.isLoadingReplies !== nextProps.isLoadingReplies ||
			this.compareReplies(this.props.comment.replies, nextProps.comment.replies));
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
	getPrimaryControls = (comment) => {
		const isReply = comment.parentID != null;
		const hasReplies = comment.repliesCount > 0;

		return (
			<div className="primary-controls" style={styles.commentControls.right}>
				{!isReply && <FlatButton label={comment.repliesCount + (comment.repliesCount == 1 ? ' Reply' : ' Replies')} primary={hasReplies} disabled={!hasReplies} onClick={() => this.props.loadReplies(comment.id, 'openReplies')} />}
				<FlatButton label="Reply" primary onClick={() => this.props.openReplyBoxToolbar(comment.id, comment.parentID, comment.userName, isReply)} />
			</div>
		);
	}
	compareReplies = (currentReplies, nextReplies) => {
		if (currentReplies.length !== nextReplies.length) return true;

		for (let i = 0; i < currentReplies.length; i++) {
			if (currentReplies[i].id !== nextReplies[i].id) return true;
			if (currentReplies[i].votes !== nextReplies[i].votes) return true;
		}

		return false;
	}

	openEdit = () => {
		const { comment } = this.props;
		this.props.openEdit(comment.id, comment.parentID, comment.userName);
	}

	closeEdit = () => {
		this.props.cancelAll().then(() => {
			this.setState({
				errorText: '',
				textFieldValue: this.props.comment.message,
			});
		});
	}

	renderReplies = () => this.props.comment.replies.map(reply => (
		<Comment
			key={reply.id}
			comment={reply}
			isEditing={this.props.isEditing}
			isReplying={this.state.isReplying}
			activeComment={this.props.activeComment}
			openEdit={this.props.openEdit}
			cancelAll={this.props.cancelAll}
			openReplyBoxToolbar={this.props.openReplyBoxToolbar}
			voteComment={this.props.voteComment}
			editComment={this.props.editComment}
			deleteComment={this.props.deleteComment}
			getLikes={this.props.getLikes}
		/>
	))

	getLikes = () => {
		const { getLikes, comment } = this.props;
		console.log(this);
		getLikes(comment.id);
	}

	getEditControls = () => {
		const saveDisabled = this.state.errorText.length === 0;

		return (
			<div className="edit-controls" style={styles.commentControls.right}>
				<FlatButton label="Cancel" onClick={this.closeEdit} />
				<FlatButton label="Save" primary={saveDisabled} disabled={!saveDisabled} onClick={() => { this.props.editComment(this.props.comment, this.state.textFieldValue); }} />
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
					[ <MenuItem primaryText="Edit" key={`edit${comment.id}`} onClick={this.openEdit} />,
						<MenuItem primaryText="Delete" key={`remove${comment.id}`} onClick={() => { this.props.deleteComment(comment); }} /> ]
					:
					<MenuItem primaryText="Report" key={`report${comment.id}`} />
			}
		</IconMenu>
	)

	getVoteControls = comment => (
		<div className="vote-controls" style={styles.commentControls.left}>
			<IconButton className="upvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => this.props.voteComment(comment, 1)}>
				<ThumbUp color={comment.vote === 1 ? blueGrey500 : grey500} />
			</IconButton>
			<Likes votes={comment.votes} getLikes={this.getLikes} />
			<IconButton className="downvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => this.props.voteComment(comment, -1)}>
				<ThumbDown color={comment.vote === -1 ? blueGrey500 : grey500} />
			</IconButton>
		</div>
	)

	getEditableArea = (comment) => {
		const isEditing = (this.props.isEditing && this.props.activeComment.id === comment.id);

		return (
			<div style={styles.commentContent}>
				{!isEditing && <div className="original-message" dangerouslySetInnerHTML={{ __html: updateMessage(this.state.textFieldValue) }} style={styles.commentMessage} />}
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
		const { comment, isLoadingReplies } = this.props;
		const {
			id,
			date,
			userID,
			replies,
			parentID,
			avatarUrl,
			userName,
			repliesCount,
		} = comment;
		const isReply = parentID != null;
		const isEditing = (this.props.isEditing && this.props.activeComment.id === id);

		if (!isReply) {
			return (
				<div className="comment-container" style={styles.commentContainer.base}>
					<div className="primary comment" style={styles.comment.base}>
						<div className="content" style={styles.commentConent}>
							<ProfileAvatar
								size={40}
								userID={userID}
								userName={userName}
								avatarUrl={avatarUrl}
							/>
							<div
								className="comment-details-wrapper"
								style={{
									...styles.commentDetailsWrapper.base,
									...(isEditing ? styles.commentDetailsWrapper.editing : {}),
								}}
							>
								<div className="comment-details" style={styles.commentDetails}>
									<div style={styles.heading}>
										<Link to={`/profile/${userID}`} style={styles.noStyle}>
											<span className="name" style={styles.userName}>{userName}</span>
										</Link>
										<div style={styles.heading}>
											<p className="date" style={styles.commentDate}>{updateDate(date)}</p>
											{!isEditing && this.getMenuControls(comment)}
										</div>
									</div>
									{this.getEditableArea(comment)}
								</div>
								<div className="controls" style={styles.commentControls.base}>
									{!isEditing && this.getVoteControls(comment)}
									{isEditing && this.getEditControls()}
									{!isEditing && this.getPrimaryControls(comment)}
								</div>
							</div>
						</div>
					</div>
					{ replies.length > 0 ?
						<div className="replies" style={styles.replies.base}>
							<div className="replies-content" style={styles.replies.content}>
								{this.renderReplies()}
							</div>
							<div className="gap" style={styles.commentsGap}>
								{(replies.length !== repliesCount) &&
									<FlatButton label="Load more" primary onClick={() => this.props.loadReplies(id, 'loadMore')} />}
							</div>
						</div> :
						isLoadingReplies &&
						<div style={{ height: 40 }}>
							<LoadingOverlay style={{ top: 115 }} size={30} />
						</div>
					}
				</div>
			);
		}
		return (
			<div className="secondary comment" style={styles.comment.base}>
				<div className="content" style={styles.commentConent}>
					<ProfileAvatar
						size={40}
						userID={userID}
						userName={userName}
						avatarUrl={avatarUrl}
					/>
					<div
						className="comment-details-wrapper"
						style={{
							...styles.commentDetailsWrapper.base,
							...(isEditing ? styles.commentDetailsWrapper.editing : {}),
						}}
					>
						<div className="comment-details" style={styles.commentDetails}>
							<div style={styles.heading}>
								<Link to={`/profile/${userID}`} style={styles.noStyle}>
									<span className="name" style={styles.userName}>{userName}</span>
								</Link>
								<div style={styles.heading}>
									<p className="date" style={styles.commentDate}>{updateDate(date)}</p>
									{!isEditing && this.getMenuControls(comment)}
								</div>
							</div>
							{this.getEditableArea(comment)}
						</div>
						<div className="controls" style={styles.commentControls.base}>
							{!isEditing && this.getVoteControls(comment)}
							{isEditing && this.getEditControls()}
							{!isEditing && this.getPrimaryControls(comment)}
						</div>
					</div>
				</div>
			</div>
		);
	}
}

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	getLikes: getLikesInternal(3),
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
