import React from 'react';
import { translate } from 'react-i18next';

import {
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	PopupActions,
} from 'components/atoms';
import {
	FlatButton,
} from 'components/molecules';

const RemovePopup = ({
	open,
	onClose,
	removeAction,
	t,
}) => (
	<Popup
		onClose={onClose}
		open={open}
	>
		<PopupTitle>Remove User Post</PopupTitle>
		<PopupContent>
			<PopupContentText>Are you sure you want to permanently remove this post?</PopupContentText>
		</PopupContent>
		<PopupActions>
			<FlatButton
				variant="contained"
				onClick={onClose}
			>
				{t('common.cancel-title')}
			</FlatButton>
			<FlatButton
				variant="contained"
				onClick={removeAction}
			>
				{t('common.delete-title')}
			</FlatButton>
		</PopupActions>
	</Popup>
);

export default translate()(RemovePopup);
