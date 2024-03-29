import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import ReportPopup from 'components/ReportPopup';
import ReportItemTypes from 'constants/ReportItemTypes';
import {
	Container,
	Popup,
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';
import SignInPopup from 'components/SignInPopup';
import RemovalPopup from './RemovalPopup';
import CommentItem from './CommentItem';
import './comment.scss';

@translate(null, { withRef: true })
@observer
class CommentView extends Component {
	state={
		signinPopupOpen: false,
	}
	@observable highlighted = false;
	@observable deleteOpen = false;
	@observable isEditing = false;
	@observable removalPopupOpen = false;
	@observable reportPopupOpen = false;

	@action toggleReportPopup = () => {
		const {userProfile,toggleSigninPopup}=this.props;
		if (!userProfile) {
			toggleSigninPopup();
		} else {
			this.reportPopupOpen = !this.reportPopupOpen;
		}
	}

	@action toggleSigninPopup=() => {
		this.setState({ signinPopupOpen: !this.state.signinPopupOpen });
	}

	@action toggleRemovalPopup = () => {
		this.removalPopupOpen = !this.removalPopupOpen;
	}
	@action toggleDeleteDialog = () => {
		this.deleteOpen = !this.deleteOpen;
	}
	@action toggleEdit = () => {
		this.isEditing = !this.isEditing;
	}
	scrollIntoView = () => {
		this.mainDiv.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.highlighted = true;
		setTimeout(() => {
			this.highlighted = false;
		}, 2000);
	}
	onReply = () => {
		const {toggleSigninPopup,userProfile}=this.props;
		if (!userProfile) {
			toggleSigninPopup();
		} else {
			const {
				id, userID, userName, parentID,
			} = this.props.comment;
			const isReply = parentID !== null;
			this.props.onReply({
				id, userID, userName, isReply,
			});
		}
	}
	render() {
		const {
			id,
		} = this.props.comment;
		const { signinPopupOpen } = this.state;
		const {
			commentsType, userProfile,
			onVote, selfDestruct, onRepliesButtonClick,
			t, onRequestRemoval, accessLevel, onReply, toggleSigninPopup,
			...rest
		} = this.props;

		return (
			<Container
				ref={(node) => { this.mainDiv = node; }}
				className={`comment-item ${this.highlighted ? 'animate' : ''}`}
			>
				<CommentItem
					comment={this.props.comment}
					type={commentsType}
					onVote={onVote}
					onReply={this.onReply}
					onRepliesButtonClick={onRepliesButtonClick}
					accessLevel={accessLevel}
					userProfileId={userProfile && userProfile.id}
					toggleDeleteDialog={this.toggleDeleteDialog}
					toggleReportPopup={this.toggleReportPopup}
					toggleRemovalPopup={this.toggleRemovalPopup}
					toggleEdit={this.toggleEdit}
					toggleSigninPopup={toggleSigninPopup}
					{...rest}
				/>
				<Popup
					onClose={this.toggleDeleteDialog}
					open={this.deleteOpen}
				>
					<PopupTitle>{t('comments.lesson_comment_remove_title')}</PopupTitle>
					<PopupContent>
						<PopupContentText>{t('comments.lesson_comment_remove_message')}</PopupContentText>
					</PopupContent>
					<PopupActions>
						<FlatButton
							variant="contained"
							onClick={this.toggleDeleteDialog}
						>
							{t('common.cancel-title')}
						</FlatButton>
						<FlatButton
							variant="contained"
							onClick={selfDestruct}
						>
							{t('common.delete-title')}
						</FlatButton>
					</PopupActions>
				</Popup>

				<RemovalPopup
					open={this.removalPopupOpen}
					accessLevel={accessLevel}
					commentsType={commentsType}
					onClose={this.toggleRemovalPopup}
					deleteComment={selfDestruct}
					report={onRequestRemoval}
				/>
				<ReportPopup
					open={this.reportPopupOpen}
					itemId={id}
					onClose={this.toggleReportPopup}
					itemType={ReportItemTypes[`${commentsType}Comment`]}
				/>
			</Container>
		);
	}
}

export default CommentView;
