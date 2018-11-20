import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { PaperContainer, Title, FlexBox, Image, TextBlock } from 'components/atoms';
import LanguageSelector from 'components/LanguageSelector';

@translate()
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
		const { language, t } = this.props;
		return (
			<Fragment>
				<PaperContainer onClick={this.toggleLanguageSelector} className="container">
					<FlexBox justifyBetween align className="select-language">
						<Title>{t('settings.language')}</Title>
						<FlexBox align>
							<TextBlock>
								{language === null ? t('common.option-select') : language.languageName}
							</TextBlock>
							<Image src="/assets/keyboard_arrow_right.svg" />
						</FlexBox>
					</FlexBox>
				</PaperContainer>
				<LanguageSelector
					open={isLanguageSelectorOpen}
					onClose={this.toggleLanguageSelector}
					onChoose={this.selectLanguage}
					filter={course => course.isQuizFactoryEnabled}
				/>
			</Fragment>
		);
	}
}

export default LanguageSelectorTab;
