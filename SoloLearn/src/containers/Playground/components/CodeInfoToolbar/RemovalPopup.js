import React from 'react';
import { translate } from 'react-i18next';
import {
	Popup,
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';

const RemovalPopup = ({
	t,
	open,
	onClose,
	onDelete,
}) => (
	<Popup
		open={open}
		onClose={onClose}
	>
		<PopupTitle>{t('code_playground.popups.delete-code-description')}</PopupTitle>
		<PopupContent>
			<PopupContentText>{t('comments.lesson_comment_remove_message')}</PopupContentText>
		</PopupContent>
		<PopupActions>
			<FlatButton
				onClick={onClose}
				color="secondary"
			>
				{t('common.cancel-title')}
			</FlatButton>
			<FlatButton
				variant="primary"
				onClick={onDelete}
			>
				{t('common.delete-title')}
			</FlatButton>
		</PopupActions>
	</Popup>
);

export default translate()(RemovalPopup);
