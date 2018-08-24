import React from 'react';
import 'styles/languageCard.scss';
import { getLanguageColor } from 'utils';

const languageCardStyle = {
	display: 'flex',
	width: 40,
	height: 40,
	margin: 4,
};

const getContrast50 = hexcolor => ((parseInt(hexcolor.substring(1), 16) > 0xffffff / 2) ? 'black' : 'white');

const LanguageCard = ({ language, style }) => {
	const backgroundColor = getLanguageColor(language);
	const color = getContrast50(backgroundColor);
	return (
		<div
			className="colored-box"
			style={{
				...style, // need for mateial ui injection in ListItem
				...languageCardStyle,
				backgroundColor,
				color,
			}}
		>
			{language}
		</div>
	);
};

export default LanguageCard;
