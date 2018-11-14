import React, { Component } from 'react';
import { translate } from 'react-i18next';
import ReportItemTypes from 'constants/ReportItemTypes';
import {
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	PopupActions,
} from 'components/atoms';

import { FlatButton } from 'components/molecules';

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
				variant="contained"
				onClick={this.requestRemoval}
			>
				{cannotRemove ?
					t('common.confirm-title') :
					t('common.remove-title')
				}
			</FlatButton>,
			<FlatButton
				variant="contained"
				onClick={onRequestClose}
			>
				{t('common.cancel-title')}
			</FlatButton>,
		];
		return (
			<Popup
				open={open}
				onClose={onRequestClose}
			>
				<PopupTitle>
					{cannotRemove ?
						t('comments.lesson_comment_request_removal_title') :
						t('comments.lesson_comment_remove_title')
					}
				</PopupTitle>
				<PopupContent>
					<PopupContentText>
						{cannotRemove ?
							t('comments.lesson_comment_request_removal_message') :
							t('comments.lesson_comment_remove_message')
						}
					</PopupContentText>
				</PopupContent>
				<PopupActions>
					{actions}
				</PopupActions>
			</Popup>
		);
	}
}

export default RemovalPopup;
