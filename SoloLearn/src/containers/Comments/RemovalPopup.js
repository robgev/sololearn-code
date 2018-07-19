import React, { PureComponent } from 'react';
import { translate } from 'react-i18next';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';
import Service from 'api/service';
import ReportItemTypes from 'constants/ReportItemTypes';
import { deleteCommentInternal } from 'actions/comments';

@translate()
class RemovalPopup extends PureComponent {
	requestRemoval = async () => {
		const {
			comment,
			itemType,
			accessLevel,
			commentsType,
			onRequestClose,
			removedItemId,
			onSubmitFinished,
		} = this.props;
		try {
			if (accessLevel > 1 || itemType === ReportItemTypes.lessonComment) {
				const { id, parentId } = comment;
				deleteCommentInternal(id, parentId, commentsType);
			} else {
				Service.request('ReportItem', {
					itemType,
					reason: 100, // Server reason for moderator prompt.
					itemId: removedItemId,
				});
			}
			if (typeof onSubmitFinished === 'function') {
				onSubmitFinished();
			}
			onRequestClose();
		} catch (e) {
			console.log(e);
		}
	}

	render() {
		const {
			t,
			open,
			accessLevel,
			commentsType,
			onRequestClose,
		} = this.props;
		const cannotRemove = accessLevel === 1 && commentsType !== 'lesson';
		const actions = [
			<FlatButton
				primary
				onClick={onRequestClose}
				label={t('common.cancel-title')}
			/>,
			<FlatButton
				primary
				onClick={() => this.requestRemoval()}
				label={cannotRemove ?
					t('common.confirm-title') :
					t('common.remove-title')
				}
			/>,
		];
		return (
			<Dialog
				open={open}
				actions={actions}
				onRequestClose={onRequestClose}
				title={cannotRemove ?
					t('comments.lesson_comment_request_removal_title') :
					t('comments.lesson_comment_remove_title')
				}
			>
				{cannotRemove ?
					t('comments.lesson_comment_request_removal_message') :
					t('comments.lesson_comment_remove_message')
				}
			</Dialog>
		);
	}
}

export default RemovalPopup;
