import React from 'react';
import { translate } from 'react-i18next';
import { RaisedButton } from 'components/molecules';

const PreviewButton = ({ t, ...props }) => (
	<RaisedButton
		fullWidth
		color="primary"
		{...props}
	>
		{t('factory.quiz-preview-title')}
	</RaisedButton>
);

export default translate()(PreviewButton);
