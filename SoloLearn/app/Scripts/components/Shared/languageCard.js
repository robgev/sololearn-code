import React from 'react';
import 'styles/languageCard.scss';
import { Link } from 'react-router';
import { getLanguageColor } from 'utils';

const LanguageCard = ({ language, alias, linkPrefix }) => (
	<Link to={`${linkPrefix}/${alias}`} className="language-card-main-container">
		<div
			className="colored-box"
			style={{ backgroundColor: getLanguageColor(language) }}
		>
			{language}
		</div>
	</Link>
);

export default LanguageCard;
