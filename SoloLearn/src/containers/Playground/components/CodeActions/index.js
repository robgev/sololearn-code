import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { Container, Checkbox, FlexBox } from 'components/atoms';
import { ConsecutiveSnackbar, FlatButton } from 'components/molecules';
import { Run } from 'components/icons'; // InsertLink
import SavePopup from './SavePopup';
// import ExternalResourcePopup from './ExternalResourcePopup';

import './styles.scss';

@translate()
@observer
class Toolbar extends Component {
	state = {
		isSavePopupOpen: false,
		isSourcePopupOpen: false,
	};

	handleSaveClick = () => {
		const { playground } = this.props;
		if (playground.isMyCode) {
			playground.saveCode();
		} else {
			this.toggleSavePopup();
		}
	}

	toggleSavePopup = () => {
		this.setState(({ isSavePopupOpen }) => ({ isSavePopupOpen: !isSavePopupOpen }));
	}

	// toggleSourcePopup = () => {
	// 	this.setState(({ isSourcePopupOpen }) => ({ isSourcePopupOpen: !isSourcePopupOpen }));
	// }

	render() {
		const {
			isSavePopupOpen,
			// isSourcePopupOpen,
		} = this.state;
		const { t, playground } = this.props;
		return (
			<FlexBox align justifyBetween noShrink>
				<Container>
					<Checkbox
						checked={playground.isDark}
						onChange={playground.toggleTheme}
						label={t('code_playground.dark-theme')}
					/>
					{/* {playground.isWeb && !playground.isInline &&
						<FlatButton onClick={this.toggleSourcePopup}>
							External Resources
							<InsertLink />
						</FlatButton>
					} */}
				</Container>
				<Container>
					{!playground.isInline &&
						<FlatButton
							onClick={this.handleSaveClick}
							disabled={playground.isSaving}
						>
							{t('common.save-action-title')}
						</FlatButton>
					}
					<FlatButton
						disabled={playground.isSaving}
						onClick={this.toggleSavePopup}
					>
						{t('code_playground.actions.save-as')}
					</FlatButton>
					<FlatButton
						onClick={playground.resetToSaved}
						disabled={playground.isResetDisabled || playground.isSaving || playground.isRunning}
					>
						{t('code_playground.actions.reset-code')}
					</FlatButton>

					<FlatButton
						className="playground_run-button"
						disabled={playground.isSaving || playground.isRunning}
						onClick={playground.isWeb
							? playground.runWebCode
							: playground.runCompiledCode
						}
					>
						Run
						<Run />
					</FlatButton>
					<SavePopup
						open={isSavePopupOpen}
						playground={playground}
						onClose={this.toggleSavePopup}
					/>
					{/* <ExternalResourcePopup
						playground={playground}
						open={isSourcePopupOpen}
						onClose={this.toggleSourcePopup}
					/> */}
					<ConsecutiveSnackbar
						open={playground.isSaving}
						autoHideDuration={playground.isSaving ? null : 1500}
						message={playground.isSaving ? 'Saving...' : t('code_playground.alert.saved-title')}
					/>
				</Container>
			</FlexBox>
		);
	}
}

export default Toolbar;
