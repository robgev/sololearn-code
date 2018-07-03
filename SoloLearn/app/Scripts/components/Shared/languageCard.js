import React from 'react';
import 'styles/languageCard.scss';
import { getLanguageColor } from 'utils';

const languageCardStyle = {
	display: 'flex',
	width: 40,
	height: 40,
	margin: 4,
};

const LanguageCard = ({ language, style }) => (
	<div
		className="colored-box"
		style={{
			...style, // need for mateial ui injection in ListItem
			...languageCardStyle,
			backgroundColor: getLanguageColor(language),
		}}
	>
		{language}
	</div>
);

export default LanguageCard;
