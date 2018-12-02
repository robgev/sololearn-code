import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';

import LanguageSelector from 'components/LanguageSelector';

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
					filter={c => c.language !== 'sql'}
				/>
			</Fragment>
		);
	}
}

export default AddCodeButton;
