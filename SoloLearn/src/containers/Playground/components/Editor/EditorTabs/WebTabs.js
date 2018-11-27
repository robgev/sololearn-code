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
			/>,
			<Tab
				key={languages.css}
				value="css"
				label={languages.css}
			/>,
			<Tab
				key={languages.javascript}
				value="javascript"
				label={languages.javascript}
			/>,
		]
		}
		{ playground.language === 'php' &&
		<Tab
			value="php"
			label={languages.php}
		/>
		}
	</Tabs>
);

export default withRouter(WebTabs);
