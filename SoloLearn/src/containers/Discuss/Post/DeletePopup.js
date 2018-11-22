import React from 'react';
import { translate } from 'react-i18next';
import { Popup, PopupContent, PopupActions } from 'components/atoms';
import { FlatButton } from 'components/molecules';

const DeletePopup = ({
	t, onClose, onDelete, open,
}) => (
	<Popup
		open={open}
		onClose={onClose}
	>
		<PopupContent>
			{t('discuss.delete-question-message')}
		</PopupContent>
		<PopupActions>
			<FlatButton
				onClick={onClose}
			>
				{t('common.cancel-title')}
			</FlatButton>
			<FlatButton
				onClick={onDelete}
			>
				{t('common.delete-title')}
			</FlatButton>
		</PopupActions>
	</Popup>
);

export default translate()(DeletePopup);
