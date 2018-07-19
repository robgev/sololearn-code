// React modules
import React from 'react';
import { Link } from 'react-router';
import { getLanguageColor, truncate } from 'utils';

import 'styles/Feed/codeFeedItem.scss';

const Code = ({ code }) => {
	const {
		jsCode,
		language,
		publicID,
		sourceCode,
	} = code;
	const isJSLonger = jsCode && jsCode.length > sourceCode.length;
	const previewCode = isJSLonger ? jsCode : sourceCode;
	return (
		<div className="code-item-container">
			<Link
				className="code-feed-item-wrapper"
				to={`/playground/${publicID}/${isJSLonger ? 'js' : ''}`}
			>
				<p className="code-snippet">
					{truncate(previewCode, 500, 6, true)}
				</p>
				<span
					className="language-tag"
					style={{ backgroundColor: getLanguageColor(language) }}
				>
					{language}
				</span>
			</Link>
		</div>
	);
};

export default Code;
