import React from 'react';
import { getLanguageColor } from 'utils';

import 'styles/components/LanguageIcon.scss';

const LanguageIcon = ({ language, className }) => (
	<div
		className={`language-icon ${className}`}
		style={{ backgroundColor: getLanguageColor(language) }}
	>
		{language}
	</div>
);

export default LanguageIcon;
