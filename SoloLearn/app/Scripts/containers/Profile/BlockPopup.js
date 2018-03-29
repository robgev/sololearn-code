import React from 'react';
import { translate } from 'react-i18next';
import Dialog from 'material-ui/Dialog';
import FlatButton from 'material-ui/FlatButton';

const BlockPopup = ({
	blockUser, onRequestClose, open, t,
}) => {
	const actions = [
		<FlatButton
			primary
			onClick={onRequestClose}
			label={t('common.cancel-title')}
		/>,
		<FlatButton
			primary
			onClick={blockUser}
			label={t('common.block-user')}
		/>,
	];
	return (
		<Dialog
			open={open}
			actions={actions}
			onRequestClose={onRequestClose}
			title={t('block.user.title')}
		>
			{t('block.user.message')}
		</Dialog>
	);
};

export default translate()(BlockPopup);
