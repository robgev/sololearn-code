import React from 'react';
import { FlexBox } from 'components/atoms';
import { getLanguageColor } from 'utils';

import './styles.scss';

const getContrast50 = hexcolor => ((parseInt(hexcolor.substring(1), 16) > 0xffffff / 2) ? 'black' : 'white');

const LanguageCard = ({ language, style }) => {
	const backgroundColor = getLanguageColor(language);
	const color = getContrast50(backgroundColor);
	return (
		<FlexBox
			align
			justify
			className="colored-box"
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
