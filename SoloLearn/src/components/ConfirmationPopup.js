import React from 'react';

import {
	Popup,
	PopupTitle,
	PopupContent,
	PopupActions,
} from 'components/atoms';
import { RaisedButton, FlatButton } from 'components/molecules';

const ConfirmationPopup = ({
	open, onCancel, onConfirm, confirmButtonLabel, title = 'Confirm', children,
}) => (
	<Popup open={open} onClose={onCancel}>
		<PopupTitle>{title}</PopupTitle>
		<PopupContent>
			{children}
		</PopupContent>
		<PopupActions>
			<FlatButton onClick={onCancel}>
				Cancel
			</FlatButton>

			<RaisedButton color="primary" onClick={onConfirm}>
				{confirmButtonLabel}
			</RaisedButton>

		</PopupActions>
	</Popup>
);

export default ConfirmationPopup;
