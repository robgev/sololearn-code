import React from 'react';
import Tabs from '@material-ui/core/Tabs';
import Tab from '@material-ui/core/Tab';
import { withRouter, browserHistory } from 'react-router';

const onLanguageChange = location =>
	(_, language) => browserHistory.replace({ ...location, query: { ...location.query, language } });

const WebTabs = ({ location, languages, playground }) => (
	<Tabs
		value={playground.language}
		onChange={onLanguageChange(location)}
	>
		{ playground.isWeb &&
		[
			<Tab
				key={languages.html}
				value="html"
				label={languages.html}
				onClick={playground.hideOutput}
			/>,
			<Tab
				key={languages.css}
				value="css"
				label={languages.css}
				onClick={playground.hideOutput}
			/>,
			<Tab
				key={languages.javascript}
				value="javascript"
				label={languages.javascript}
				onClick={playground.hideOutput}
			/>,
		]
		}
		{ playground.language === 'php' &&
		<Tab
			value="php"
			label={languages.php}
			onClick={playground.hideOutput}
		/>
		}
	</Tabs>
);

export default withRouter(WebTabs);
