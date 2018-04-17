import React from 'react';
import { getLanguageColor } from 'utils';

import 'styles/components/Shared/LanguageIcon.scss';

const LanguageIcon = ({ language }) => (
	<div
		className="language-icon"
		style={{ backgroundColor: getLanguageColor(language) }}
	>
		{language}
	</div>
);

export default LanguageIcon;
