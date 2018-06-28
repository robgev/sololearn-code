// React modules
import React from 'react';

// i18n
import { translate } from 'react-i18next';

// Material UI components
import { Tabs, Tab } from 'material-ui/Tabs';
import FlatButton from 'material-ui/FlatButton';

// App defaults and utils
import editorSettings from 'defaults/playgroundEditorSettings';

const styles = {
	webTabs: {
		dark: {
			backgroundColor: '#2f3129',
		},

		light: {
			backgroundColor: '#ebebeb',
		},
	},

	webTab: {
		dark: {
			color: '#fff',
			borderRight: '1px solid #A8A8A8',
		},

		light: {
			color: '#777',
			borderRight: '1px solid #C1C1C1',
		},
	},

	defaultTab: {
		base: {
			lineHeight: '48px',
			textAlign: 'right',
			padding: '0 15px 0 0',
			height: '48px',
			fontSize: '16px',
			fontWeight: 500,
			borderRadius: '4px 4px 0 0',
		},

		dark: {
			backgroundColor: '#2f3129',
			color: '#fff',
		},

		light: {
			backgroundColor: '#ebebeb',
			color: '#777',
		},
	},
};

const PlaygroundTabs = ({
	type,
	mode,
	theme,
	runCode,
	handleTabChange,
	t,
}) => {
	const isDarkTheme = theme === 'monokai';

	if (type === 'web') {
		return (
			<div style={{
				display: 'flex',
				borderBottom: `1px solid ${isDarkTheme ? '#A8A8A8' : '#C1C1C1'}`,
			}}
			>
				<Tabs
					value={mode}
					style={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						height: 36,
					}}
					inkBarStyle={{ height: 0 }}
					onChange={handleTabChange}
					tabItemContainerStyle={isDarkTheme ? styles.webTabs.dark : styles.webTabs.light}
				>
					<Tab
						label="HTML"
						value="html"
						buttonStyle={{ height: 36 }}
						style={{
							...(isDarkTheme ? styles.webTab.dark : styles.webTab.light),
							...(mode === 'html' ? { backgroundColor: isDarkTheme ? '#494B43' : '#D2D2D2' } : {}),
						}}
					/>
					<Tab
						label="CSS"
						value="css"
						buttonStyle={{ height: 36 }}
						style={{
							...(isDarkTheme ? styles.webTab.dark : styles.webTab.light),
							...(mode === 'css' ? { backgroundColor: isDarkTheme ? '#494B43' : '#D2D2D2' } : {}),
						}}
					/>
					<Tab
						label="JS"
						value="javascript"
						buttonStyle={{ height: 36 }}
						style={{
							...(isDarkTheme ? styles.webTab.dark : styles.webTab.light),
							...(mode === 'javascript' ? { backgroundColor: isDarkTheme ? '#494B43' : '#D2D2D2' } : {}),
						}}
					/>
				</Tabs>
				<div style={{
					display: 'flex',
					flex: 1,
					justifyContent: 'flex-end',
					alignItems: 'center',
					background: isDarkTheme ? '#2F3129' : '#ebebeb',
				}}
				>
					<FlatButton
						label={t('code_playground.output')}
						style={{
							color: isDarkTheme ? '#fff' : '#777',
							background: isDarkTheme ? '#2F3129' : '#ebebeb',
						}}
						onClick={runCode}
					/>
				</div>
			</div>
		);
	} else if (type === 'combined') {
		return (
			<div style={{
				display: 'flex',
				borderBottom: `1px solid ${isDarkTheme ? '#A8A8A8' : '#C1C1C1'}`,
			}}
			>
				<Tabs
					value={mode}
					style={{
						display: 'flex',
						flexDirection: 'column',
						flex: 1,
						height: 36,
					}}
					inkBarStyle={{ height: 0 }}
					onChange={handleTabChange}
					tabItemContainerStyle={isDarkTheme ? styles.webTabs.dark : styles.webTabs.light}
				>
					<Tab
						label="PHP"
						value="php"
						buttonStyle={{ height: 36 }}
						style={{
							...(isDarkTheme ? styles.webTab.dark : styles.webTab.light),
							...(mode === 'css' ? { backgroundColor: isDarkTheme ? '#494B43' : '#D2D2D2' } : {}),
						}}
					/>
				</Tabs>
				<div style={{
					display: 'flex',
					flex: 1,
					justifyContent: 'flex-end',
					alignItems: 'center',
					background: isDarkTheme ? '#2F3129' : '#ebebeb',
				}}
				>
					<FlatButton
						label={t('code_playground.output')}
						style={{
							color: isDarkTheme ? '#fff' : '#777',
							background: isDarkTheme ? '#2F3129' : '#ebebeb',
						}}
						onClick={runCode}
					/>
				</div>
			</div>
		);
	}
	return (
		<div style={isDarkTheme ? { ...styles.defaultTab.base, ...styles.defaultTab.dark } : { ...styles.defaultTab.base, ...styles.defaultTab.light }} >
			{editorSettings[mode].name}
		</div>
	);
};

export default translate()(PlaygroundTabs);
