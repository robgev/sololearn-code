import React, { Component } from 'react';
import Paper from 'material-ui/Paper';
import Localize from 'components/Localize';
import LanguageSelector from 'components/LanguageSelector';

class LanguageSelectorTab extends Component {
	state = {
		isLanguageSelectorOpen: false,
	}
	toggleLanguageSelector = () => {
		this.setState(s => ({ isLanguageSelectorOpen: !s.isLanguageSelectorOpen }));
	}
	selectLanguage = (lang) => {
		this.props.selectLanguage(lang);
		this.toggleLanguageSelector();
	}
	render() {
		const { isLanguageSelectorOpen } = this.state;
		const { language } = this.props;
		return (
			<Localize>
				{({ t }) => (
					<React.Fragment>
						<Paper onClick={this.toggleLanguageSelector} className="selected-language container">
							<span className="title">{t('settings.language')}</span>
							<div className="with-image">
								<span className="language-name">{language === null ? t('common.option-select') : language.languageName}</span>
								<img src="/assets/keyboard_arrow_right.svg" alt="" />
							</div>
						</Paper>
						<LanguageSelector
							open={isLanguageSelectorOpen}
							onClose={this.toggleLanguageSelector}
							onChoose={this.selectLanguage}
							filter={course => course.isQuizFactoryEnabled}
						/>
					</React.Fragment>
				)}
			</Localize>
		);
	}
}

export default LanguageSelectorTab;
