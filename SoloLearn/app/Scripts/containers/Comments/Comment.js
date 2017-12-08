// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { Link } from 'react-router';
import { CellMeasurerCache } from 'react-virtualized';

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
import getLikes from 'actions/likes';

// Utils
import Likes from 'components/Shared/Likes';
import { updateDate, updateMessage } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LoadingOverlay from 'components/Shared/LoadingOverlay';
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';

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
	getPrimaryControls = (comment) => {
		const isReply = comment.parentID != null;
		const hasReplies = !!comment.replies;

		return (
			<div className="primary-controls" style={styles.commentControls.right}>
				{!isReply &&
					<FlatButton
						label={comment.replies + (comment.replies === 1 ? ' Reply' : ' Replies')}
						primary={hasReplies}
						disabled={!hasReplies}
						onClick={() => this.props.loadReplies(comment.id, 'openReplies')}
					/>}
				<FlatButton label="Reply" primary onClick={() => this.props.openReplyBoxToolbar(comment.id, comment.parentID, comment.userName, isReply)} />
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
		const { getLikes, comment } = this.props;
		getLikes(this.props.commentType === 'lesson' ? 3 : 4, comment.id);
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

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	getLikes,
};

export default connect(mapStateToProps, mapDispatchToProps)(Comment);
