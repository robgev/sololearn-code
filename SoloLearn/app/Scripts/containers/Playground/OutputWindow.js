// React modules
import React from 'react';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

// i18n
import { translate } from 'react-i18next';

const styles = {
	webOutput: {
		base: {
			position: 'relative',
			width: '100%',
		},

		show: {
			display: 'block',
		},

		hide: {
			display: 'none',
		},
	},

	webIframe: {
		width: '100%',
		height: '500px',
	},

	jsConsole: {
		base: {
			borderTop: '1px solid #dedede',
			height: '60px',
			padding: '5px 0px 0 10px',
			fontSize: '12px',
			wordWrap: 'break-word',
			overflowY: 'scroll',
		},

		hide: {
			display: 'none',
		},
	},

	jsConsoleLabel: {
		display: 'block',
		fontSize: '13px',
		margin: '0 0 3px 0',
		fontWeight: 500,
	},

	logMessage: {
		margin: '0 0 3px 0',
		fontWeight: 500,
		color: '#B71C1C',
	},

	errorMessage: {
		color: '#424242',
	},
}

const OutputWindow = ({
	type,
	showWebOutput,
	programRunning,
	t,
}) =>  (
	<div
		className="web-output"
		style={{
			...styles.webOutput.base,
			...(showWebOutput ? styles.webOutput.show : styles.webOutput.hide),
		}}
	>
			{ !programRunning ? null :
				<LoadingOverlay />
			}
			<iframe id="output-frame" frameBorder="0" style={styles.webIframe}></iframe>
			<div id="js-console" style={type == "web" ? styles.jsConsole.base : styles.jsConsole.hide}>
					<label style={styles.jsConsoleLabel}>JavaScript {t('code_playground.console.title')}</label>
					<div className="log-message" style={styles.logMessage}></div>
					<div className="error-message" style={styles.errorMessage}></div>
			</div>
	</div>
);

export default translate()(OutputWindow);
