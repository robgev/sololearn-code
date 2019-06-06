import React, { Component, Fragment, createRef } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { ListItem, HorizontalDivider, Container, FlexBox } from 'components/atoms';
import { RaisedButton } from 'components/molecules';
import { VoteActions, Mention, CountingMentionInput } from 'components/organisms';
import ReportPopup from 'components/ReportPopup';
import PreviewItem from 'components/PreviewItem';
import { generatePreviews } from 'utils';
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
					<Container
						ref={this.postContainer}
						className={`post ${isHighlighted ? 'animate-highlight' : ''} ${reply.isAccepted ? 'accepted' : ''}`}
					>
						<Container className="info">
							<Container className="toolbar">
								<Container className="votes">
									<VoteActions
										id={reply.id}
										type="post"
										vertical
										initialCount={reply.votes}
										initialVote={reply.vote}
									/>
								</Container>
								<Container>
									<AcceptReply
										askerID={askerID}
										isAccepted={reply.isAccepted}
										onClick={onAccept}
									/>
								</Container>
							</Container>
							<Container className="question">
								<Container>
									<Mention text={reply.message} />
								</Container>
								<Container className="question-preview-container">
									{generatePreviews(reply.message).map(preview => (
										<Container key={preview.link} className="preview">
											<PreviewItem
												{...preview}
											/>
										</Container>
									))}
								</Container>
							</Container>
							<Container className="options">
								<Options
									userID={reply.userID}
									deletePost={this.openDeletePopup}
									editPost={this.toggleEdit}
									reportPost={this.openReportPopup}
									requestRemoval={this.openRemovalPopup}
								/>
							</Container>
						</Container>
						<Container className="user">
							<Author
								level={reply.level}
								badge={reply.badge}
								userID={reply.userID}
								avatarUrl={reply.avatarUrl}
								userName={reply.userName}
								date={reply.date}
							/>
						</Container>
					</Container>
				</ListItem>
				<HorizontalDivider />
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
