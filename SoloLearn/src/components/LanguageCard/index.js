import React from 'react';
import { FlexBox } from 'components/atoms';
import { getLanguageColor } from 'utils';

import './styles.scss';

const getContrast50 = (hexcolor) => {
	// For more info check
	// http://www.w3.org/TR/AERT#color-contrast
	const red = parseInt(hexcolor.substring(1, 3), 16) * 299;
	const green = parseInt(hexcolor.substring(3, 5), 16) * 587;
	const blue = parseInt(hexcolor.substring(5, 7), 16) * 114;
	const contrast = Math.round((red + green + blue) / 1000);
	return contrast > 200 ? 'black' : 'white';
};

const LanguageCard = ({
	big, language, style, className,
}) => {
	const backgroundColor = getLanguageColor(language);
	const color = getContrast50(backgroundColor);
	return (
		<FlexBox
			align
			justify
			noShrink
			className={`colored-box ${big ? 'big' : ''} ${className}`}
			style={{
				...style, // need for mateial ui injection in ListItem
				backgroundColor,
				color,
			}}
		>
			{language}
		</FlexBox>
	);
};

export default LanguageCard;
