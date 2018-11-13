// React modules
import React from 'react';
import { getLanguageColor, truncate } from 'utils';
import BottomToolbarWithVotes from '../BottomToolbarWithVotes';
import {
	Container,
	Link,
	TextBlock,
	SecondaryTextBlock
} from 'components/atoms';
import { LanguageLabel } from 'components/molecules';

import 'styles/Feed/codeFeedItem.scss';

const Code = ({
	code,
	date,
	userVote,
	totalVotes,
	onChange,
}) => {
	const {
		jsCode,
		language,
		publicID,
		sourceCode,
	} = code;
	const isJSLonger = jsCode && jsCode.length > sourceCode.length;
	const previewCode = isJSLonger ? jsCode : sourceCode;
	return (
		<Container>
			<Container className="code-item-container">
				<Link
					className="code-feed-item-wrapper"
					to={`/playground/${publicID}/${isJSLonger ? 'js' : ''}`}
				>
					<TextBlock className="code-snippet">
						{truncate(previewCode, 500, 6, true)}
					</TextBlock>
					<LanguageLabel
						className="language-tag"
						language={language}
					/>
				</Link>
			</Container>
			<BottomToolbarWithVotes
				type='code'
				id={code.id}
				date={date}
				userVote={userVote}
				totalVotes={totalVotes}
				onChange={onChange}
			/>
		</Container>
	);
};

export default Code;
