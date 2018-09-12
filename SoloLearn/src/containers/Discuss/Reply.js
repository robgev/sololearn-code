// General modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import Linkify from 'react-linkify';

// Material UI components
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import Snackbar from 'material-ui/Snackbar';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import AcceptedIcon from 'material-ui/svg-icons/navigation/check';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500, lightGreen500 } from 'material-ui/styles/colors';

// Redux modules
import { editPostInternal, toggleAcceptedAnswerInternal } from 'actions/discuss';

import Likes from 'components/Likes';
import ProfileAvatar from 'components/ProfileAvatar';
import PreviewItem from 'components/PreviewItem';
import UserTooltip from 'components/UserTooltip';
import { showError, updateDate, determineAccessLevel, generatePreviews, replaceMention } from 'utils';
import MentionInput from 'components/MentionInput';

import { ReplyStyles as styles } from './styles';
import './reply.scss';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	editPostInternal,
	toggleAcceptedAnswerInternal,
};

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
@Radium
class Reply extends Component {
	state = {
		isEditing: false,
		replyLength: 0,
		animate: false,
		snackbarOpen: false,
	};

	onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.setState({ replyLength });
		}
	}

	getEditableArea = () => {
		const { reply, t, recompute } = this.props;
		const previewsData = generatePreviews(this.props.reply.message);

		if (!this.state.isEditing) {
			return (
				<div>
					<pre className="message" style={styles.message}>
						<Linkify>
							{replaceMention(this.props.reply.message)}
						</Linkify>
					</pre>
					{previewsData.map(singlePreviewData => (
						<PreviewItem
							{...singlePreviewData}
							recompute={recompute}
							key={singlePreviewData.link}
						/>
					))}
				</div>
			);
		}

		const { replyLength } = this.state;
		const saveDisabled = replyLength === 0;

		return (
			[
				<div key={`editor${reply.id}`} style={styles.editor}>
					<MentionInput
						ref={(input) => { this.mentionInput = input; }}
						initText={this.props.reply.message}
						onLengthChange={this.onLengthChange}
						getUsers={{ type: 'discuss' }}
					/>
					<span style={styles.textFieldCoutner} key={`replyTextCounter${reply.id}`}>{2048 - this.state.replyLength}</span>
				</div>,
				<div key={`editorActions${reply.id}`} style={styles.editorActions}>
					<FlatButton label={t('common.cancel-title')} onClick={() => this.closeEdit()} />
					<FlatButton label={t('common.save-action-title')} primary disabled={saveDisabled} onClick={this.save} />
				</div>,
			]
		);
	}

	// Open answer text editor
	openEdit = () => {
		this.setState({ isEditing: true });
	}

	// Close answer text editor
	closeEdit = () => {
		this.setState({
			isEditing: false,
		});
	}

	// Save edited answer text
	save = async () => {
		const { reply } = this.props;
		this.setState({ isEditing: false });
		this.props.editPostInternal(reply, this.mentionInput.popValue())
			.catch(e => showError(e, 'Something went wrong when trying to edit'));
	}

	scrollIntoView = () => {
		this.node.scrollIntoView({ block: 'center', behavior: 'smooth' });
		this.highlight();
	}

	highlight = () => {
		this.setState({ animate: true }, () =>
			setTimeout(() => this.setState({ animate: false }), 3000));
	}

	handleSnackbarClose = () => {
		this.setState({ snackbarOpen: false });
	}

	toggleAccepted = () => {
		const { reply } = this.props;
		this.props.toggleAcceptedAnswerInternal(reply.id, reply.isAccepted);
		if (!reply.isAccepted) {
			this.setState({ snackbarOpen: true });
		}
	}

	render() {
		const {
			t, reply, accessLevel, toggleReportPopup, toggleRemovalPopup,
		} = this.props;
		const { snackbarOpen } = this.state;
		return (
			<div
				ref={(node) => { this.node = node; }}
				className={`reply ${this.state.animate ? 'animate' : ''}`}
				key={reply.id}
				style={(reply.isAccepted && !this.state.isEditing)
					? [ styles.reply.base, styles.reply.accepted ]
					: styles.reply.base}
			>
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="stats" style={styles.stats}>
						<IconButton className="upvote hoverable-icon" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => { this.props.votePost(reply, 1); }}>
							<ArrowUp color={reply.vote === 1 ? blueGrey500 : grey500} />
						</IconButton>
						<Likes
							votes={reply.votes}
							id={reply.id}
							type="post"
						/>
						<IconButton className="downvote hoverable-icon" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => { this.props.votePost(reply, -1); }}>
							<ArrowDown color={reply.vote === -1 ? blueGrey500 : grey500} />
						</IconButton>
						{
							(this.props.isUsersQuestion || accessLevel > 1) ?
								<IconButton
									className="follow hoverable-icon"
									style={styles.bestAnswerButton.base}
									iconStyle={styles.bestAnswerButton.icon}
									onClick={this.toggleAccepted}
								>
									<AcceptedIcon color={reply.isAccepted ? lightGreen500 : grey500} />
								</IconButton>
								:
								reply.isAccepted &&
								<AcceptedIcon
									color={lightGreen500}
									style={{ ...styles.bestAnswerButton.icon }}
								/>
						}
					</div>
					<div className="details" style={!this.state.isEditing ? styles.details.base : [ styles.details.base, styles.details.editing ]}>{this.getEditableArea()}</div>
					{
						!this.state.isEditing &&
						<IconMenu
							iconButtonElement={<IconButton><MoreVertIcon color={grey500} /></IconButton>}
							anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
							targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						>
							{reply.userID === this.props.userId &&
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
							{reply.userID !== this.props.userId &&
								<MenuItem
									primaryText={t('common.report-action-title')}
									onClick={() => toggleReportPopup(reply)}
								/>
							}
							{reply.userID !== this.props.userId &&
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
						<UserTooltip style={{ marginLeft: 'auto' }} userData={reply}>
							<ProfileAvatar
								reversedOrder
								withUserNameBox
								level={reply.level}
								badge={reply.badge}
								userID={reply.userID}
								avatarUrl={reply.avatarUrl}
								userName={reply.userName}
								timePassed={updateDate(reply.date)}
							/>
						</UserTooltip>
					</div>
				}
				<Snackbar
					autoHideDuration={1500}
					open={snackbarOpen}
					message={t('discuss.answer-accepted')}
					onRequestClose={this.handleSnackbarClose}
				/>
			</div>
		);
	}
}

export default Reply;
