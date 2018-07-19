import React, { Component } from 'react';
import ReactGA from 'react-ga';
import uniqBy from 'lodash/uniqBy';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';

import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

import LanguageSelector from 'components/Shared/LanguageSelector';
import languages from 'defaults/playgroundEditorSettings';

@translate()
class AddCodeButton extends Component {
	state = {
		isLanguageSelectorOpen: false,
	};

	toggleLanguagePopup = () => {
		const { isLanguageSelectorOpen } = this.state;
		if (!isLanguageSelectorOpen) {
			ReactGA.ga('send', 'screenView', { screenName: 'Code Picker Page' });
		}
		this.setState({ isLanguageSelectorOpen: !isLanguageSelectorOpen });
	}

	toggleLanguageSelector = () => {
		this.setState(state => ({ isLanguageSelectorOpen: !state.isLanguageSelectorOpen }));
	}
	selectLanguage = (courseItem) => {
		this.toggleLanguagePopup();
		browserHistory.push(`/playground/${courseItem.language}`);
	}

	render() {
		const { isLanguageSelectorOpen } = this.state;
		return (
			<div style={{
				position: 'absolute',
				width: 56,
				top: 0,
				bottom: 0,
				right: 20,
				zIndex: 1,
			}}
			>
				<FloatingActionButton
					secondary
					zDepth={3}
					style={{
						position: 'fixed',
						bottom: 25,
					}}
					onClick={this.toggleLanguagePopup}
				>
					<ContentAdd />
				</FloatingActionButton>
				<LanguageSelector
					open={isLanguageSelectorOpen}
					onChoose={this.selectLanguage}
					courses={uniqBy(Object.values(languages), 'languageName')}
					onClose={this.toggleLanguageSelector}
				/>
			</div>
		);
	}
}

export default AddCodeButton;
