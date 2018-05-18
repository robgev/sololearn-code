// General modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import { TextField, IconMenu, MenuItem, FlatButton, IconButton } from 'material-ui';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import AcceptedIcon from 'material-ui/svg-icons/navigation/check';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500, lightGreen500 } from 'material-ui/styles/colors';

// Redux modules
import { editPostInternal, toggleAcceptedAnswerInternal } from 'actions/discuss';
import getLikesAndDownvotesCurried from 'actions/likes';

import Likes from 'components/Shared/Likes';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import PreviewItem from 'components/Shared/PreviewItem';
import PostedDate from 'components/Shared/PostedDate';

import { updateDate, determineAccessLevel, generatePreviews } from 'utils';

import { ReplyStyles as styles } from './styles';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	editPostInternal,
	toggleAcceptedAnswerInternal,
	getLikes: getLikesAndDownvotesCurried('postLikes'),
	getDownvotes: getLikesAndDownvotesCurried('postDownvotes'),
};

@connect(mapStateToProps, mapDispatchToProps)
@Radium
class Reply extends Component {
	state = {
		isEditing: false,
		textFieldValue: this.props.reply.message,
		errorText: '',
	};

	getLikes = () => {
		this.props.getLikes(this.props.reply.id);
	}

	getDownvotes = () => {
		this.props.getDownvotes(this.props.reply.id);
	}

	getEditableArea = () => {
		const { reply, t, recompute } = this.props;
		const previewsData = generatePreviews(this.state.textFieldValue);

		if (!this.state.isEditing) {
			return (
				<div>
					<pre className="message" style={styles.message}>{this.state.textFieldValue}</pre>
					{ previewsData.map(singlePreviewData => (
						<PreviewItem
							{...singlePreviewData}
							recompute={recompute}
							key={singlePreviewData.link}
						/>
					))}
				</div>
			);
		}

		const saveDisabled = this.state.errorText.length === 0;

		return (
			[
				<div key={`editor${reply.id}`} style={styles.editor}>
					<TextField
						key={`replyTextField${reply.id}`}
						hintText={t('common.input_message_hint')}
						multiLine
						maxLength="2048"
						rowsMax={4}
						fullWidth
						defaultValue={this.state.textFieldValue}
						errorText={this.state.errorText}
						onChange={this.onChange}
						ref={(_editRef) => { this._editRef = _editRef; }}
						style={styles.textField}
					/>
					<span style={styles.textFieldCoutner} key={`replyTextCounter${reply.id}`}>{2048 - this.state.textFieldValue.length}</span>
				</div>,
				<div key={`editorActions${reply.id}`} style={styles.editorActions}>
					<FlatButton label={t('common.cancel-title')} onClick={() => this.closeEdit()} />
					<FlatButton label={t('common.save-action-title')} primary={saveDisabled} disabled={!saveDisabled} onClick={this.save} />
				</div>,
			]
		);
	}

	// Open answer text editor
	openEdit = () => {
		this.setState({ isEditing: true }, () => this._editRef.focus());
	}

	// Close answer text editor
	closeEdit = () => {
		this.setState({
			isEditing: false,
			textFieldValue: this.props.reply.message,
			errorText: '',
		});
	}

	// Controll answer text change
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

	// Save edited answer text
	save = () => {
		const { reply } = this.props;
		this.setState({ isEditing: false });
		this.props.editPostInternal(reply, this.state.textFieldValue);
	}

	render() {
		const {
			t, reply, accessLevel, toggleReportPopup, toggleRemovalPopup,
		} = this.props;
		return (
			<div className="reply" key={reply.id} style={(reply.isAccepted && !this.state.isEditing) ? [ styles.reply.base, styles.reply.accepted ] : styles.reply.base}>
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="stats" style={styles.stats}>
						<IconButton className="upvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => { this.props.votePost(reply, 1); }}>
							<ThumbUp color={reply.vote === 1 ? blueGrey500 : grey500} />
						</IconButton>
						<Likes
							votes={reply.votes}
							getLikes={this.getLikes}
							accessLevel={accessLevel}
							getDownvotes={this.getDownvotes}
						/>
						<IconButton className="downvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => { this.props.votePost(reply, -1); }}>
							<ThumbDown color={reply.vote === -1 ? blueGrey500 : grey500} />
						</IconButton>
					</div>
					<div className="details" style={!this.state.isEditing ? styles.details.base : [ styles.details.base, styles.details.editing ]}>{this.getEditableArea()}</div>
					{
						!this.state.isEditing &&
						<IconMenu
							iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
							targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						>
							{		reply.userID === this.props.userId &&
								[
									<MenuItem
										primaryText={t('common.edit-action-title')}
										key={`edit${reply.id}`}
										onClick={this.openEdit}
									/>,
									<MenuItem
										primaryText={t('common.delete-title')}
										key={`remove${reply.id}`}
										onClick={() => { this.props.remove(reply); }}
									/>,
								]
							}
							{ reply.userID !== this.props.userId &&
								<MenuItem
									primaryText={t('common.report-action-title')}
									onClick={() => toggleReportPopup(reply)}
								/>
							}
							{ reply.userID !== this.props.userId &&
								accessLevel > 0 &&
								<MenuItem
									onClick={() => toggleRemovalPopup(reply)}
									primaryText={accessLevel === 1 ?
										t('discuss.forum_request_removal_prompt_title') :
										t('common.remove-title')
									}
								/>
							}
						</IconMenu>
					}
				</div>
				{
					!this.state.isEditing &&
					<div className="additional-details" style={styles.additionalDetails}>
						{
							(this.props.isUsersQuestion || accessLevel > 1) ?
								<IconButton
									className="follow"
									style={styles.bestAnswerButton.base}
									iconStyle={styles.bestAnswerButton.icon}
									onClick={
										() => this.props.toggleAcceptedAnswerInternal(reply.id, reply.isAccepted)
									}
								>
									<AcceptedIcon color={reply.isAccepted ? lightGreen500 : grey500} />
								</IconButton>
								:
								reply.isAccepted &&
								<AcceptedIcon
									color={lightGreen500}
									style={{ ...styles.bestAnswerButton.icon, ...styles.bestAnswerButton.margin }}
								/>
						}
						<ProfileAvatar
							withUserNameBox
							badge={reply.badge}
							userID={reply.userID}
							avatarUrl={reply.avatarUrl}
							userName={reply.userName}
							date={updateDate(reply.date)}
						/>
						<PostedDate date={reply.date} style={{ float: 'right' }} />
					</div>
				}
			</div>
		);
	}
}

export default Reply;
