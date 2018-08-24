import React, { Component } from 'react';
import { translate } from 'react-i18next';
import Dialog from 'components/StyledDialog';
import FlatButton from 'material-ui/FlatButton';
import ReportItemTypes from 'constants/ReportItemTypes';

@translate()
class RemovalPopup extends Component {
	requestRemoval = () => {
		const {
			deleteComment, commentsType, report, onRequestClose, accessLevel,
		} = this.props;
		const itemType = ReportItemTypes[`${commentsType}Comment`];
		try {
			if (accessLevel > 1
				|| itemType === ReportItemTypes.lessonComment
				|| itemType === ReportItemTypes.userLessonComment) {
				deleteComment();
			} else {
				report();
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
		const cannotRemove = accessLevel === 1 && (commentsType !== 'lesson' && commentsType !== 'userLesson');
		const actions = [
			<FlatButton
				primary
				onClick={this.requestRemoval}
				label={cannotRemove ?
					t('common.confirm-title') :
					t('common.remove-title')
				}
			/>,
			<FlatButton
				primary
				onClick={onRequestClose}
				label={t('common.cancel-title')}
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
