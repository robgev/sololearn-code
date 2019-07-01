import React, { Component, Fragment, createRef } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { ListItem, HorizontalDivider, Container, FlexBox, PaperContainer, SecondaryTextBlock } from 'components/atoms';
import { RaisedButton, ProfileAvatar, UsernameLink, ModBadge, IconWithText } from 'components/molecules';
import { VoteActions, Mention, CountingMentionInput } from 'components/organisms';
import { Follow } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import PreviewItem from 'components/PreviewItem';
import { generatePreviews, updateDate } from 'utils';
import RemovalPopup from './RemovalPopup';
import DeletePopup from './DeletePopup';
import Options from './Options';
import Author from './Author';
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
		this.setState({ isReportPopupOpen: true });
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
			reply, deleteReply, onAccept, askerID, t,
		} = this.props;

		console.log(askerID);
		const user = reply !== null && {
			id: reply.userID,
			avatarUrl: reply.avatarUrl,
			name: reply.userName,
			level: reply.level,
		};

		if (isEditing) {
			return (
				<FlexBox column className="editing-post">
					<CountingMentionInput
						getUsers={{ type: 'discuss', params: { postId: reply.id } }}
						initText={reply.message}
						ref={this.editInput}
						onSubmitEnabledChange={this.setCanEdit}
						placeholder={t('discuss.editTitle')}
						autofocus
					/>
					<Container className="buttons">
						<RaisedButton
							className="cancel"
							onKeyDown={this.handleCancelEditEnter}
							onMouseDown={this.toggleEdit}
						>
							{t('common.cancel-title')}
						</RaisedButton>
						<RaisedButton
							color="primary"
							onMouseDown={this.edit}
							onKeyDown={this.handleEditEnter}
							disabled={!isEditEnabled}
						>
							{t('common.edit-action-title')}
						</RaisedButton>
					</Container>
				</FlexBox>
			);
		}
		return (
			<Fragment>
				<ListItem>
					<PaperContainer
						ref={this.postContainer}
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
										<UsernameLink className="author-name" to={`/profile/${reply.userID}`}>{reply.userName}</UsernameLink>
										<ModBadge
											className="badge"
											badge={reply.badge}
										/>
									</FlexBox>
									<FlexBox alignEnd className="options" justifyEnd>
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
									<SecondaryTextBlock className="edit-message">
										{t('discuss.edited-by-format').replace('()', reply.modifyUserName)},
										{updateDate(reply.modifyDate)}
									</SecondaryTextBlock>
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
								<FlexBox justifyBetween fullWidth alignEnd>
									<VoteActions
										id={reply.id}
										type="post"
										initialCount={reply.votes}
										initialVote={reply.vote}
									/>
									<SecondaryTextBlock className="text">{updateDate(reply.date)} </SecondaryTextBlock>
								</FlexBox>
							</FlexBox>
						</FlexBox>
						{/* <Container className="user">
							<Author
								level={reply.level}
								badge={reply.badge}
								userID={reply.userID}
								avatarUrl={reply.avatarUrl}
								userName={reply.userName}
								date={reply.date}
							/>
						</Container> */}
					</PaperContainer>
				</ListItem>
				{/* <HorizontalDivider /> */}
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
			</Fragment>
		);
	}
}

export default ReplyItem;
