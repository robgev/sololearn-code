// General modules
import React, { Component } from 'react';
import Radium from 'radium';
import { connect } from 'react-redux';
import Linkify from 'react-linkify';

// Material UI components
import { IconMenu, MenuItem, FlatButton, IconButton } from 'material-ui';
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
import { updateDate, determineAccessLevel, generatePreviews, replaceMention, getMentionsList } from 'utils';
import MentionInput from 'components/Shared/MentionInput';

import { ReplyStyles as styles } from './styles';
import './reply.scss';

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

@connect(mapStateToProps, mapDispatchToProps, null, { withRef: true })
@Radium
class Reply extends Component {
	state = {
		isEditing: false,
		replyLength: 0,
		animate: false,
	};

	getLikes = () => this.props.getLikes(this.props.reply.id);

	getDownvotes = () => this.props.getDownvotes(this.props.reply.id);

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
						getUsers={getMentionsList('discuss', {})}
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
	save = () => {
		const { reply } = this.props;
		this.setState({ isEditing: false });
		this.props.editPostInternal(reply, this.mentionInput.popValue());
	}

	scrollIntoView = () => {
		this.node.scrollIntoView({ block: 'center', behavior: 'smooth' });
		this.highlight();
	}

	highlight = () => {
		this.setState({ animate: true }, () =>
			setTimeout(() => this.setState({ animate: false }), 3000));
	}

	render() {
		const {
			t, reply, accessLevel, toggleReportPopup, toggleRemovalPopup,
		} = this.props;
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
							withTooltip
							reversedOrder
							withUserNameBox
							level={reply.level}
							badge={reply.badge}
							userID={reply.userID}
							avatarUrl={reply.avatarUrl}
							userName={reply.userName}
							style={{ marginLeft: 'auto' }}
							tooltipId={`reply-${reply.id}`}
							timePassed={updateDate(reply.date)}
						/>
					</div>
				}
			</div>
		);
	}
}

export default Reply;
