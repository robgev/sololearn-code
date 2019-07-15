import React, { Component, createRef } from 'react';
// import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import {
	ListItem,
	Container,
	FlexBox,
	PaperContainer,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	RaisedButton,
	FlatButton,
	ProfileAvatar,
	UsernameLink,
	ModBadge,
} from 'components/molecules';
import {
	VoteActions,
	Mention,
	CountingMentionInput,
} from 'components/organisms';
import { Edit as EditIcon } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import PreviewItem from 'components/PreviewItem';
import { generatePreviews, updateDate } from 'utils';
import RemovalPopup from './RemovalPopup';
import DeletePopup from './DeletePopup';
import Options from './Options';
import AcceptReply from './AcceptReply';

@translate(null, { withRef: true })
@observer
class ReplyItem extends Component {
	state = {
		isHighlighted: false,
		isEditing: false,
		isEditEnabled: true,
		isReportPopupOpen: false,
		isRemovalPopupOpen: false,
		isDeletePopupOpen: false,
	}
	postContainer = createRef();
	editInput = createRef();

	openDeletePopup = () => {
		this.setState({ isDeletePopupOpen: true });
	}
	closeDeletePopup = () => {
		this.setState({ isDeletePopupOpen: false });
	}

	openRemovalPopup = () => {
		this.setState({ isRemovalPopupOpen: true });
	}
	closeRemovalPopup = () => {
		this.setState({ isRemovalPopupOpen: false });
	}

	closeReportPopup = () => {
		this.setState({ isReportPopupOpen: false });
	}
	openReportPopup = () => {
		if (!this.props.userInfo) {
			this.props.toggleSigninPopup();
		} else {
			this.setState({ isReportPopupOpen: true });
		}
	}

	highlight = () => {
		this.postContainer.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.setState({ isHighlighted: true });
		this.unhighlight = setTimeout(() => {
			this.setState({ isHighlighted: false });
		}, 2000);
	}

	toggleEdit = () => {
		this.setState(s => ({ isEditing: !s.isEditing }));
	}

	handleCancelEditEnter = (e) => {
		if (e.keyCode === 13) { // on enter
			this.toggleEdit();
		}
	}
	handleEditEnter = (e) => {
		if (e.keyCode === 13) { // on enter
			this.edit();
		}
	}
	setCanEdit = (isEditEnabled) => {
		this.setState({ isEditEnabled });
	}

	edit = () => {
		const message = this.editInput.current.popValue();
		this.props.editReply(message);
		this.toggleEdit();
	}

	componentWillUnmount() {
		if (this.unhighlight) {
			clearTimeout(this.unhighlight);
		}
	}

	render() {
		const {
			isEditing, isHighlighted, isReportPopupOpen,
			isEditEnabled, isRemovalPopupOpen, isDeletePopupOpen,
		} = this.state;
		const {
			reply, deleteReply, onAccept, askerID, t, toggleSigninPopup,
		} = this.props;

		const user = reply !== null && {
			id: reply.userID,
			avatarUrl: reply.avatarUrl,
			name: reply.userName,
			level: reply.level,
		};

		if (isEditing) {
			return (
				<PaperContainer className="post">
					<FlexBox column className="editing-post">
						<CountingMentionInput
							getUsers={{ type: 'discuss', params: { postId: reply.id } }}
							initText={reply.message}
							ref={this.editInput}
							onSubmitEnabledChange={this.setCanEdit}
							placeholder={t('discuss.editTitle')}
							autofocus
							className="editing-post-input"
						/>
						<Container className="buttons">
							<FlatButton
								className="cancel-button"
								onKeyDown={this.handleCancelEditEnter}
								onMouseDown={this.toggleEdit}
							>
								{t('common.cancel-title')}
							</FlatButton>
							<RaisedButton
								color="primary"
								onMouseDown={this.edit}
								onKeyDown={this.handleEditEnter}
								disabled={!isEditEnabled}
								className="editing-post-button"
							>
								{t('common.edit-action-title')}
							</RaisedButton>
						</Container>
					</FlexBox>
				</PaperContainer>
			);
		}
		return (
			<Container ref={this.postContainer}>
				<ListItem>
					<PaperContainer
						className={`post ${isHighlighted ? 'animate-highlight' : ''} ${reply.isAccepted ? 'accepted' : ''}`}
					>
						<FlexBox className="info">
							<ProfileAvatar
								className="user-avatar"
								user={user}
							/>
							<FlexBox className="question">
								<FlexBox fullWidth justifyBetween>
									<FlexBox className="author">
										<UsernameLink
											className="author-name"
											to={`/profile/${reply.userID}`}
										>
											{reply.userName}
										</UsernameLink>
										<ModBadge
											className="badge"
											badge={reply.badge}
										/>
									</FlexBox>
									<FlexBox align className="options" justifyEnd>
										<AcceptReply
											askerID={askerID}
											isAccepted={reply.isAccepted}
											onClick={onAccept}
										/>
										<Options
											userID={reply.userID}
											deletePost={this.openDeletePopup}
											editPost={this.toggleEdit}
											reportPost={this.openReportPopup}
											requestRemoval={this.openRemovalPopup}
										/>
									</FlexBox>
								</FlexBox>
								<Container className="message">
									<Mention text={reply.message} />
								</Container>
								{
									reply.modifyDate && reply.modifyUserID && reply.modifyUserName &&
									<FlexBox className="edit-message-container other-margin" align>
										<Container className="edit-message-icon" >
											<EditIcon />
										</Container>
										<SecondaryTextBlock className="edited-message">
											{t('discuss.edited-by-format').replace('()', reply.modifyUserName)},
											{updateDate(reply.modifyDate)}
										</SecondaryTextBlock>
									</FlexBox>
								}
								<Container className="question-preview-container">
									{generatePreviews(reply.message).map(preview => (
										<Container key={preview.link} className="preview">
											<PreviewItem
												{...preview}
											/>
										</Container>
									))}
								</Container>
								<FlexBox justifyBetween fullWidth align>
									<VoteActions
										id={reply.id}
										type="post"
										initialCount={reply.votes}
										initialVote={reply.vote}
										className="discuss-reply-item-vote-actions"
										toggleSigninPopup={toggleSigninPopup}
									/>
									<SecondaryTextBlock className="reply-item-date">{updateDate(reply.date)} </SecondaryTextBlock>
								</FlexBox>
							</FlexBox>
						</FlexBox>
					</PaperContainer>
				</ListItem>
				<ReportPopup
					open={isReportPopupOpen}
					onClose={this.closeReportPopup}
					itemId={reply.id}
					itemType={2}
				/>
				<RemovalPopup
					open={isRemovalPopupOpen}
					id={reply.id}
					deletePost={deleteReply}
					onClose={this.closeRemovalPopup}
				/>
				<DeletePopup
					open={isDeletePopupOpen}
					onClose={this.closeDeletePopup}
					onDelete={deleteReply}
				/>
			</Container>
		);
	}
}

export default ReplyItem;
