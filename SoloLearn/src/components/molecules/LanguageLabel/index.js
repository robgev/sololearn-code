import React from 'react';
import { getLanguageColor } from 'utils';
import { Label } from 'components/atoms';
import './styles.scss';

const LanguageLabel = ({ language, className, ...props }) => (
	<Label
		backgroundColor={getLanguageColor(language)}
		className={`molecule_language-label ${className}`}
		{...props}
	>
		{language}
	</Label>
);

export default LanguageLabel;
