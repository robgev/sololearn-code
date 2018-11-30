import React, { PureComponent } from 'react';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import { Snackbar, Checkbox, FlexBox } from 'components/atoms';
import { FlatButton, RaisedButton } from 'components/molecules';
import { Run, InsertLink } from 'components/icons';
import SavePopup from './SavePopup';
import ExternalResourcePopup from './ExternalResourcePopup';

@translate()
@observer
class Toolbar extends PureComponent {
	state = {
		isSnackbarOpen: false,
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

	toggleSourcePopup = () => {
		this.setState(({ isSourcePopupOpen }) => ({ isSourcePopupOpen: !isSourcePopupOpen }));
	}

	handleSnackBarClose = (reason) => {
		// TODO: Snackbar logic
		if (reason !== 'clickaway') {
			this.setState({ isSnackbarOpen: false });
		}
	}

	render() {
		const {
			isSnackbarOpen,
			isSavePopupOpen,
			isSourcePopupOpen,
		} = this.state;
		const { t, playground } = this.props;
		return (
			<FlexBox align justifyBetween noShrink>
				<div>
					<Checkbox
						checked={playground.isDark}
						onChange={playground.toggleTheme}
						label={t('code_playground.dark-theme')}
					/>
					{playground.isWeb && !playground.isInline &&
						<FlatButton onClick={this.toggleSourcePopup}>
							External Resources
							<InsertLink />
						</FlatButton>
					}
				</div>
				<div>
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
						disabled={playground.isResetDisabled}
					>
						{t('code_playground.actions.reset-code')}
					</FlatButton>

					<RaisedButton
						variant="secondary"
						disabled={playground.isSaving || playground.isRunning}
						onClick={playground.isWeb
							? playground.runWebCode
							: playground.runCompiledCode
						}
					>
						Run
						<Run />
					</RaisedButton>
					<SavePopup
						open={isSavePopupOpen}
						playground={playground}
						onClose={this.toggleSavePopup}
					/>
					<ExternalResourcePopup
						playground={playground}
						open={isSourcePopupOpen}
						onClose={this.toggleSourcePopup}
					/>
					<Snackbar
						open={playground.isSaving}
						onClose={this.handleSnackBarClose}
						message={playground.isSaving ? 'Saving...' : t('code_playground.alert.saved-title')}
					/>
				</div>
			</FlexBox>
		);
	}
}

export default Toolbar;
