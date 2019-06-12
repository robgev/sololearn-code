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
	PromiseButton,
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
				autoFocus
			>
				{t('common.cancel-title')}
			</FlatButton>
			<PromiseButton
				variant="contained"
				fire={removeAction}
			>
				{t('common.delete-title')}
			</PromiseButton>
		</PopupActions>
	</Popup>
);

export default translate()(RemovePopup);
