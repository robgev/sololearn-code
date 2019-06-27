import React, { Component } from 'react';
import { connect } from 'react-redux';
import { observer } from 'mobx-react';
import { translate } from 'react-i18next';

import {
	FlexBox,
	Container,
	Checkbox,
	TextBlock,
	MenuItem,
	HorizontalDivider,
} from 'components/atoms';
import {
	ConsecutiveSnackbar,
	FlatButton,
	IconMenu,
} from 'components/molecules';
import { Run } from 'components/icons'; // InsertLink
import SavePopup from './SavePopup';
// import ExternalResourcePopup from './ExternalResourcePopup';

import './styles.scss';

const mapStateToProps = state => ({
	codes: state.userProfile.codes,
});

@translate()
@connect(mapStateToProps)
@observer
class Toolbar extends Component {
	state = {
		isSavePopupOpen: false,
		// isSourcePopupOpen: false,
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
		const { t, playground, codes } = this.props;
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
					<IconMenu
						className={`playground_code-actions-menu ${playground.isDark ? 'dark' : 'light'}`}
					>
						<MenuItem
							className="playground_code-actions-menu-item"
							onClick={this.handleSaveClick}
							disabled={playground.isSaving}
						>
							{t('common.save-action-title')}
						</MenuItem>
						<MenuItem
							className="playground_code-actions-menu-item"
							disabled={playground.isSaving}
							onClick={this.toggleSavePopup}
						>
							{t('code_playground.actions.save-as')}
						</MenuItem>
						<MenuItem
							className="playground_code-actions-menu-item"
							onClick={playground.resetToSaved}
							disabled={playground.isResetDisabled || playground.isSaving || playground.isRunning}
						>
							{t('code_playground.actions.reset')}
						</MenuItem>
						<MenuItem
							className="playground_code-actions-menu-item"
						>
							{t('common.share-title')}
						</MenuItem>
						<HorizontalDivider className="playground_code-actions-divider" />
						<MenuItem
							className="playground_code-actions-menu-item"
						>
							<FlexBox justify align fullWidth>
								{t('code.filter.my-codes')}
								<TextBlock className="playground_code-actions-number">{codes}</TextBlock>
							</FlexBox>
						</MenuItem>
					</IconMenu>

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
