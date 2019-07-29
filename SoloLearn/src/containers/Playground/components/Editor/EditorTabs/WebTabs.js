import React from 'react';
import { observer } from 'mobx-react';
import { withRouter, browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import { Tab, Tabs } from 'components/atoms';

const onLanguageChange = location =>
	(_, language) => {
		if (language !== '') {
			browserHistory.replace({ ...location, query: { ...location.query, language } });
		}
	};

const WebTabs = ({
	t, location, languages, playground,
}) => (
	<Tabs
		className="playground_web-tabs-root"
		value={playground.isOutputOpen ? '' : playground.language} // Hide selected tab when output is open
		onChange={onLanguageChange(location)}
	>
		{ playground.isWeb &&
		[
			<Tab
				key={languages.html}
				value="html"
				label={languages.html}
				className="playground-tab"
				onClick={playground.hideOutput}
			/>,
			<Tab
				key={languages.css}
				value="css"
				label={languages.css}
				className="playground-tab"
				onClick={playground.hideOutput}
			/>,
			<Tab
				key={languages.js}
				value="js"
				label={languages.js}
				className="playground-tab"
				onClick={playground.hideOutput}
			/>,
		]
		}
		{ playground.language === 'php' &&
		<Tab
			value="php"
			label={languages.php}
			className="playground-tab"
			onClick={playground.hideOutput}
		/>
		}

		{ !playground.isInline &&
		<Tab
			value=""
			label={t('code_playground.output')}
			className="playground-tab"
			onClick={playground.language === 'php' ? playground.runCompiledCode : playground.runWebCode}
		/>
		}
	</Tabs>
);

export default translate()(withRouter(observer(WebTabs)));
