import React, { Component } from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';
import ProfileAvatar from 'components/ProfileAvatar';
import VoteControls from 'components/VoteControls';
import { IconMenu, MenuItem, FlatButton, IconButton, Dialog } from 'material-ui';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { replaceMention } from 'utils';
import './comment.scss';

@translate(null, { withRef: true })
@observer
class CommenView extends Component {
	@observable highlighted = false;
	@observable deleteOpen = false;
	@observable isEditing = false;
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
		const { id, userID, userName } = this.props.comment;
		this.props.onReply({ id, userID, userName });
	}
	render() {
		const {
			message, level, userName, avatarUrl,
			vote, votes, userID, replies, badge, id, parentID,
		} = this.props.comment;
		const {
			userProfile, getUpvotes, getDownvotes,
			upvote, downvote, selfDestruct, onRepliesButtonClick,
			t, children,
		} = this.props;
		return (
			<div
				ref={(node) => { this.mainDiv = node; }}
				className={`comment-item ${this.highlighted ? 'animate' : ''}`}
			>
				{children({ isEditing: this.isEditing, message, toggleEdit: this.toggleEdit, id })}
				<ProfileAvatar
					size={40}
					withTooltip
					withUserNameBox
					level={level}
					badge={badge}
					userID={userID}
					userName={userName}
					avatarUrl={avatarUrl}
					tooltipId={`comment-${id}`}
				/>
				<VoteControls
					getVotes={getUpvotes}
					userVote={vote}
					accessLevel={userProfile.accessLevel}
					totalVotes={votes}
					getDownvotes={getDownvotes}
					buttonStyle={{ height: 32, width: 32, padding: 0 }}
					onUpvote={upvote}
					onDownvote={downvote}
				/>
				<IconMenu
					iconButtonElement={<IconButton ><MoreVertIcon /></IconButton>}
					anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
				>
					{userID === userProfile.id &&
						[
							<MenuItem
								primaryText={t('common.edit-action-title')}
								key={`edit${id}`}
								onClick={this.toggleEdit}
							/>,
							<MenuItem
								primaryText={t('common.delete-title')}
								key={`remove${id}`}
								onClick={this.toggleDeleteDialog}
							/>,
						]
					}
					{userID !== userProfile.id &&
						<MenuItem
							primaryText={t('common.report-action-title')}
							onClick={() => { }}
						/>
					}
				</IconMenu>
				{
					parentID === null && (
						<div>
							<FlatButton
								label={`${replies} ${replies === 1 ? t('comments.reply') : t('comments.replies-other')}`}
								disabled={replies === 0}
								onClick={onRepliesButtonClick}
							/>
						</div>
					)
				}
				<FlatButton
					label="Reply"
					onClick={this.onReply}
				/>
				<Dialog
					open={this.deleteOpen}
					actions={[
						<FlatButton
							label="Delete"
							onClick={selfDestruct}
						/>,
						<FlatButton
							label="Cancel"
							onClick={this.toggleDeleteDialog}
						/>,
					]}
				>
					Are you sure you want to delete
				</Dialog>
			</div>
		);
	}
}

export default CommenView;
