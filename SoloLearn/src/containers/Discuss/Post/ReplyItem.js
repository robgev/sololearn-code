import React, { Component, Fragment, createRef } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { ListItem, HorizontalDivider, Container, FlexBox } from 'components/atoms';
import { RaisedButton } from 'components/molecules';
import { VoteActions, Mention, CountingMentionInput } from 'components/organisms';
import ReportPopup from 'components/ReportPopup';
import Options from './Options';
import Author from './Author';
import AcceptReply from './AcceptReply';

@translate()
@observer
class ReplyItem extends Component {
	state = {
		isHighlighted: false,
		isEditing: false,
		isEditEnabled: true,
		isReportPopupOpen: false,
	}
	postContainer = createRef();
	editInput = createRef();

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
			isEditing, isHighlighted, isReportPopupOpen, isEditEnabled,
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
					/>
					<Container className="buttons">
						<RaisedButton
							className="cancel"
							onMouseDown={this.toggleEdit}
						>
							{t('common.cancel-title')}
						</RaisedButton>
						<RaisedButton
							className="edit"
							onMouseDown={this.edit}
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
								<Container className="message">
									<Mention text={reply.message} />
								</Container>
							</Container>
							<Container className="options">
								<Options
									userID={reply.userID}
									deletePost={deleteReply}
									editPost={this.toggleEdit}
									reportPost={this.openReportPopup}
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
					onRequestClose={this.closeReportPopup}
					itemId={reply.id}
					itemType="post"
				/>
			</Fragment>
		);
	}
}

export default ReplyItem;
