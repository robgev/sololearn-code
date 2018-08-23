import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import uniqBy from 'lodash/uniqBy';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';

import LanguageSelector from 'components/LanguageSelector';
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
			<Fragment>
				{this.props.children({ togglePopup: this.toggleLanguagePopup })}
				<LanguageSelector
					open={isLanguageSelectorOpen}
					onChoose={this.selectLanguage}
					onClose={this.toggleLanguageSelector}
					courses={uniqBy(Object.values(languages), 'languageName')}
				/>
			</Fragment>
		);
	}
}

export default AddCodeButton;
