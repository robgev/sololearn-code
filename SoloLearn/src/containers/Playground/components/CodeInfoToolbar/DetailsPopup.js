import React from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import {
	Popup,
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
} from 'components/atoms';
import { updateDate } from 'utils';
import { FlatButton } from 'components/molecules';

const DetailsPopup = ({
	t,
	open,
	onClose,
	playground,
}) => (
	<Popup
		open={open}
		onClose={onClose}
	>
		<PopupTitle>{t('code_playground.details.title')}</PopupTitle>
		<PopupContent>
			<PopupContentText>{t('code_playground.details.name')}: {playground.data.name}</PopupContentText>
			<PopupContentText>{t('code_playground.details.author')}: {playground.data.userName}</PopupContentText>
			<PopupContentText>{t('code_playground.details.modified')}: {updateDate(playground.data.modifiedDate)}</PopupContentText>
			<PopupContentText>{t('code_playground.details.date')}: {updateDate(playground.data.createdDate)}</PopupContentText>
			<PopupContentText>{t('code_playground.details.lines')}: {playground.numberOfLines}</PopupContentText>
			<PopupContentText>{t('code_playground.details.chars')}: {playground.numberOfSymbols}</PopupContentText>
		</PopupContent>
		<PopupActions>
			<FlatButton
				onClick={onClose}
			>
				{t('common.close-title')}
			</FlatButton>
		</PopupActions>
	</Popup>
);

export default translate()(observer(DetailsPopup));
