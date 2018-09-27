import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Localize from 'components/Localize';

const PreviewButton = ({ disabled, onClick }) => (
	<Localize>
		{({ t }) => (
			<RaisedButton
				className="preview-button"
				label={t('factory.quiz-preview-title')}
				fullWidth
				primary
				onClick={onClick}
				disabled={disabled}
			/>
		)}
	</Localize>
);

export default PreviewButton;
