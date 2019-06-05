import React, { Component, Fragment } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
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
		if (courseItem.language !== 'web') {
			browserHistory.push({ pathname: '/playground/new', query: { language: courseItem.language } });
		} else {
			browserHistory.push({ pathname: '/playground/new', query: { language: 'html' } });
		}
	}

	filter = course => course.language !== 'sql'
			&& course.language !== 'css'
			&& course.language !== 'js';

	getFilteredCodeLanguages = () => {
		const filteredCodeLanguages = this.props.courses.filter(this.filter);
		const htmlItemIndex = filteredCodeLanguages.findIndex(el => el.id === 1014);
		filteredCodeLanguages[htmlItemIndex].language = 'web';
		filteredCodeLanguages[htmlItemIndex].languageName = 'Web';
		filteredCodeLanguages.push({ language: 'kt', languageName: 'kotlin' });
		return filteredCodeLanguages;
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
					courses={this.getFilteredCodeLanguages()}
				/>
			</Fragment>
		);
	}
}

const mapStateToProps = state => (
	{ courses: state.courses }
);

export default connect(mapStateToProps)(AddCodeButton);
