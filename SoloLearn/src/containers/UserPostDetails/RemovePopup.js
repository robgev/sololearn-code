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
	canRemove,
	t,
}) => (
	<Popup
		onClose={onClose}
		open={open}
	>
		<PopupTitle>
			{
				canRemove
					? 'Remove User Post'
					: 'Request Removal'
			}
		</PopupTitle>
		<PopupContent>
			<PopupContentText>
				{
					canRemove
						? 'Are you sure you want to permanently remove this post?'
						: 'Are you sure you want to mark this comment for removal?'
				}
			</PopupContentText>
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
				{
					canRemove
						? t('common.delete-title')
						: t('common.confirm-title')
				}
			</PromiseButton>
		</PopupActions>
	</Popup>
);

export default translate()(RemovePopup);
