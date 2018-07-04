// React modules
import React, { Component } from 'react';
import ReactGA from 'react-ga';
import { map, uniqBy } from 'lodash';

// i18n
import { translate } from 'react-i18next';

// Material UI components
import Dialog from 'material-ui/Dialog';
import FloatingActionButton from 'material-ui/FloatingActionButton';
import ContentAdd from 'material-ui/svg-icons/content/add';

// Redux modules
import LanguageCard from 'components/Shared/LanguageCard';
import editorSettings from 'defaults/playgroundEditorSettings';

@translate()
class AddCodeButton extends Component {
	constructor() {
		super();
		const languagesArray = map(editorSettings, item => item);
		const languages = uniqBy(languagesArray, 'language');
		this.state = {
			languages,
			isLanguagePopupOpen: false,
		};
	}

	toggleLanguagePopup = () => {
		const { isLanguagePopupOpen } = this.state;
		if (!isLanguagePopupOpen) {
			ReactGA.ga('send', 'screenView', { screenName: 'Code Picker Page' });
		}
		this.setState({ isLanguagePopupOpen: !isLanguagePopupOpen });
	}

	render() {
		const { isLanguagePopupOpen, languages } = this.state;
		const { t } = this.props;
		return (
			<div style={{
				position: 'absolute',
				width: 56,
				top: 0,
				bottom: 0,
				right: 5,
				zIndex: 1,
			}}
			>
				<FloatingActionButton
					secondary
					zDepth={3}
					style={{
						position: 'fixed',
						bottom: 5,
					}}
					onClick={this.toggleLanguagePopup}
				>
					<ContentAdd />
				</FloatingActionButton>
				<Dialog
					title={t('code.language-picker-title')}
					open={isLanguagePopupOpen}
					onRequestClose={this.toggleLanguagePopup}
				>
					{
						languages.map(currentElement => (
							<LanguageCard
								{...currentElement}
								linkPrefix="/playground"
							/>
						))
					}
				</Dialog>
			</div>
		);
	}
}

export default AddCodeButton;
