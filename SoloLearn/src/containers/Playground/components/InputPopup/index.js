import React from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import {
	Input,
	Popup,
	PopupTitle,
	PopupActions,
	PopupContent,
	PopupContentText,
	SecondaryTextBlock,
} from 'components/atoms';
import { FlatButton } from 'components/molecules';

const InputPopup = ({
	t,
	playground,
}) => (
	<Popup
		open={playground.isInputPopupOpen}
		onClose={playground.toggleInputPopup}
	>
		<PopupTitle>{t('code_playground.alert.input-needs-title')}</PopupTitle>
		<PopupContent>
			<PopupContentText>{t('code_playground.alert.input-needs-message')}</PopupContentText>
			<Input
				multiLine
				fullWidth
				value={playground.inputValue}
				onChange={playground.changeInputValue}
			/>
			<SecondaryTextBlock>
				{playground.inputValue.length}/{playground.MAX_INPUT_LENGTH}
			</SecondaryTextBlock>
		</PopupContent>
		<PopupActions>
			<FlatButton
				variant="primary"
				onClick={playground.runCompiledCode}
			>
				{t('common.submit-action-title')}
			</FlatButton>
		</PopupActions>
	</Popup>
);

export default translate()(observer(InputPopup));
