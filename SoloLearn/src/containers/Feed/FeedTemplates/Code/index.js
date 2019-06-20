// React modules
import React from 'react';
import AceEditor from 'react-ace';
import { truncate } from 'utils';
import {
	Link,
	Container,
} from 'components/atoms';
import { LanguageLabel } from 'components/molecules';
import { editorModeNames } from 'containers/Playground/utils/Mappings';

import 'brace/mode/html';
import 'brace/mode/css';
import 'brace/mode/c_cpp';
import 'brace/mode/java';
import 'brace/mode/php';
import 'brace/mode/python';
import 'brace/mode/csharp';
import 'brace/mode/ruby';
import 'brace/mode/kotlin';
import 'brace/mode/swift';
import 'brace/theme/monokai'; // Editor dark theme
import 'brace/ext/language_tools';

import BottomToolbarWithVotes from '../../BottomToolbarWithVotes';
import './styles.scss';

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
	const calculatedLanguage = language === 'web'
		? isJSLonger ? 'js' : 'html'
		: language;
	return (
		<Container>
			<Container className="code-item-container">
				<Link
					className="code-feed-item-wrapper"
					to={`/playground/${publicID}/${isJSLonger ? 'js' : ''}`}
				>
					<AceEditor
						readOnly
						wrapEnabled
						value={truncate(previewCode, 800, 18, false)}
						width="100%"
						height="300px"
						theme="monokai"
						showPrintMargin={false}
						mode={editorModeNames[calculatedLanguage]}
						setOptions={{
							showLineNumbers: true,
							useWorker: false,
							tabSize: 2,
							highlightGutterLine: false,
							showFoldWidgets: false,
							displayIndentGuides: false,
							highlightActiveLine: false,
						}}
						name={publicID}
						className="feed-template_code-preview"
						annotations={[]}
					/>
					<LanguageLabel
						className="language-tag"
						language={language}
					/>
				</Link>
			</Container>
			<BottomToolbarWithVotes
				type="code"
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
