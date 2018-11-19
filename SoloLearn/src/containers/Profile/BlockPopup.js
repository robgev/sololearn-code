import React from 'react';
import { translate } from 'react-i18next';
import {
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	PopupActions
} from 'components/atoms';
import { FlatButton } from 'components/molecules'

const BlockPopup = ({
	blockUser, onRequestClose, open, t,
}) => {
	const actions = [
		<FlatButton
			onClick={onRequestClose}
		>
			{t('common.cancel-title')}
		</FlatButton>,
		<FlatButton
			onClick={blockUser}
		>
			{t('common.block-user')}
		</FlatButton>,
	];
	return (
		<Popup
			open={open}
			onClose={onRequestClose}
		>
			<PopupTitle>{t('block.user.title')}</PopupTitle>
			<PopupContent>
				<PopupContentText>
					{t('block.user.message')}
				</PopupContentText>
			</PopupContent>
			<PopupActions>
				{actions}
			</PopupActions>
		</Popup>
		
	);
};

export default translate()(BlockPopup);
