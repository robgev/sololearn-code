import React from 'react';
import { translate } from 'react-i18next';

import {
	Popup,
	PopupTitle,
	PopupContent,
	PopupActions,
} from 'components/atoms';
import { RaisedButton, FlatButton } from 'components/molecules';

const ConfirmationPopup = ({
	open, onCancel, onConfirm, confirmButtonLabel, title = 'Confirm', children, t,
}) => (
	<Popup open={open} onClose={onCancel}>
		<PopupTitle>{title}</PopupTitle>
		<PopupContent>
			{children}
		</PopupContent>
		<PopupActions>
			<FlatButton onClick={onCancel}>
				{t('common.cancel-title')}
			</FlatButton>

			<RaisedButton color="primary" onClick={onConfirm}>
				{confirmButtonLabel}
			</RaisedButton>

		</PopupActions>
	</Popup>
);

export default translate()(ConfirmationPopup);
