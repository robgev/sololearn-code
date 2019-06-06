import React from 'react';
import { translate } from 'react-i18next';
import { Popup, PopupContent, PopupActions } from 'components/atoms';
import { FlatButton, PromiseButton } from 'components/molecules';

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
				autoFocus
			>
				{t('common.cancel-title')}
			</FlatButton>
			<PromiseButton
				className="submit-button"
				fire={onDelete}
			>
				{t('common.delete-title')}
			</PromiseButton>
		</PopupActions>
	</Popup>
);

export default translate()(DeletePopup);
