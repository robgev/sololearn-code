// React modules
import React from 'react';
import { Link } from 'react-router';
import { getLanguageColor, truncate } from 'utils';

import 'styles/Feed/codeFeedItem.scss';

const Code = ({ code }) => (
	<div className="code-item-container">
		<Link to={`/playground/${code.publicID}`} className="code-feed-item-wrapper">
			<p className="code-snippet">
				{truncate(code.sourceCode, 500, 6, true)}
			</p>
			<span
				className="language-tag"
				style={{ backgroundColor: getLanguageColor(code.language) }}
			>
				{code.language}
			</span>
		</Link>
	</div>
);

export default Code;
