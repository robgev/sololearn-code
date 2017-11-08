// React modules
import React, { Component } from 'react';

// Material UI components
import { Tabs, Tab } from 'material-ui/Tabs';

// App defaults and utils
import editorSettings from '../../defaults/playgroundEditorSettings';

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
		},

		light: {
			color: '#777',
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

class PlaygroundTabs extends Component {
	render() {
		const { type, mode, theme } = this.props;
		const isDarkTheme = theme === 'monokai';

		if (type === 'web') {
			return (
				<Tabs
					value={mode}
					tabItemContainerStyle={isDarkTheme ? styles.webTabs.dark : styles.webTabs.light}
					inkBarStyle={isDarkTheme ? { background: '#dedede' } : { background: '#777' }}
				>
					<Tab
						label="HTML"
						style={isDarkTheme ? styles.webTab.dark : styles.webTab.light}
						onClick={() => this.props.handleTabChange('html')}
						value="html"
					/>
					<Tab
						label="CSS"
						style={isDarkTheme ? styles.webTab.dark : styles.webTab.light}
						onClick={() => this.props.handleTabChange('css')}
						value="css"
					/>
					<Tab
						label="JS"
						style={isDarkTheme ? styles.webTab.dark : styles.webTab.light}
						onClick={() => this.props.handleTabChange('javascript')}
						value="javascript"
					/>
					<Tab
						label="OUTPUT"
						style={isDarkTheme ? styles.webTab.dark : styles.webTab.light}
						onClick={this.runCode}
						value={null}
					/>
				</Tabs>
			);
		} else if (type === 'combined') {
			return (
				<Tabs
					value={mode}
					tabItemContainerStyle={isDarkTheme ? styles.webTabs.dark : styles.webTabs.light}
					inkBarStyle={isDarkTheme ? { background: '#dedede' } : { background: '#777' }}
				>
					<Tab
						label="PHP"
						style={isDarkTheme ? styles.webTab.dark : styles.webTab.light}
						onClick={() => this.props.handleTabChange('php')}
						value="php"
					/>
					<Tab
						label="OUTPUT"
						style={isDarkTheme ? styles.webTab.dark : styles.webTab.light}
						onClick={this.runCode}
						value={null}
					/>
				</Tabs>
			);
		}
		return (
			<div style={isDarkTheme ? { ...styles.defaultTab.base, ...styles.defaultTab.dark } : { ...styles.defaultTab.base, ...styles.defaultTab.light }} >
				{editorSettings[mode].name}
			</div>
		);
	}
}

export default PlaygroundTabs;
