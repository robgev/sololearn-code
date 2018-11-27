import React from 'react';
import { Label } from 'components/atoms';
import './styles.scss';

const LanguageIndicator = ({ language, className, ...props }) => (
	<Label
		className={`molecule_language-indicator ${className}`}
		{...props}
	>
		{language}
	</Label>
);

export default LanguageIndicator;
