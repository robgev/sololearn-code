import React, { Fragment, useState } from 'react';
import { connect } from 'react-redux';
import { browserHistory } from 'react-router';
import { Observer } from 'mobx-react';
import { translate } from 'react-i18next';

import {
	FlexBox,
	Container,
	IconButton,
	ButtonTooltip,
	TextContainer,
	TextBlock,
	MenuItem,
	HorizontalDivider,
} from 'components/atoms';
import {
	IconMenu,
	ContainerLink,
	ConsecutiveSnackbar,
} from 'components/molecules';
import {
	Save,
	Close,
	Editor,
	Output,
	Fullscreen,
	BackArrow,
	FullscreenExit,
} from 'components/icons';
import { languageNames } from 'containers/Playground/utils/Mappings';

import SavePopup from './SavePopup';
import WebTabs from './WebTabs';
import './styles.scss';

const PlaygroundTabs = ({
	t, playground, onClose, codes,
}) => {
	const [ isSavePopupOpen, setOpen ] = useState(false);

	const toggleSavePopup = () => {
		setOpen(!isSavePopupOpen);
	};

	const handleSaveClick = () => {
		if (playground.isMyCode) {
			playground.saveCode();
		} else {
			toggleSavePopup();
		}
	};

	return (
		<Observer>
			{ () => (
				<FlexBox
					justifyBetween
					align
					noShrink
					className={`playground_editor-tabs-root ${playground.isFullscreen ? 'fullscreen' : ''}  ${playground.isDark ? 'dark' : ''}`}
				>
					<FlexBox align>
						<ContainerLink to="/codes" className="playground_editor-tabs_back-button">
							<IconButton className="playground_editor-button" onClick={playground.runCompiledCode}>
								<BackArrow />
							</IconButton>
						</ContainerLink>
						{ playground.hasLiveOutput
							? (
								<WebTabs playground={playground} languages={languageNames} />
							)
							: (
								<TextContainer className="playground_editor-language-name">
									{languageNames[playground.language]}
								</TextContainer>
							)
						}
					</FlexBox>
					<Container className="playground_editor-actions">
						<Fragment>

							{!playground.isWeb &&
							<ButtonTooltip
								title="Show Output"
								placement="bottom-end"
								disabled={playground.isSaving || playground.isRunning}
							>
								<IconButton className="playground_editor-button" onClick={playground.runCompiledCode}>
									<Output />
								</IconButton>
							</ButtonTooltip>
							}
							<ButtonTooltip
								placement="bottom-end"
								disabled={playground.isSaving}
								title={t('common.save-action-title')}
							>
								<IconButton className="playground_editor-button" onClick={handleSaveClick}>
									<Save />
								</IconButton>
							</ButtonTooltip>
							<ButtonTooltip
								placement="bottom-end"
								title={playground.isDark ? 'Light Theme' : t('code_playground.dark-theme')}
							>
								<IconButton className="playground_editor-button" onClick={playground.toggleTheme}>
									<Editor />
								</IconButton>
							</ButtonTooltip>
							<ButtonTooltip
								placement="bottom-end"
								title={playground.isInline ? 'Maximize in Playground' : 'Toggle Fullscreen'}
							>
								<IconButton
									className="playground_editor-button"
									onClick={
										playground.isInline
											?	() => browserHistory.push({
												pathname: '/playground/new',
												query: { lessonCodeId: playground.lessonCodeId, language: playground.language },
											})
											:	playground.toggleFullScreen
									}
								>
									{ playground.isFullscreen
										?	<FullscreenExit />
										:	<Fullscreen />
									}
								</IconButton>
							</ButtonTooltip>
							<IconMenu
								iconClassName="playground_editor-button"
								className={`playground_code-actions-menu ${playground.isDark ? 'dark' : 'light'}`}
							>
								<MenuItem
									className="playground_code-actions-menu-item"
									onClick={handleSaveClick}
									disabled={playground.isSaving}
								>
									{t('common.save-action-title')}
								</MenuItem>
								<MenuItem
									className="playground_code-actions-menu-item"
									disabled={playground.isSaving}
									onClick={toggleSavePopup}
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
									<FlexBox justifyBetween align fullWidth>
										{t('code.filter.my-codes')}
										<TextBlock className="playground_code-actions-number">{codes}</TextBlock>
									</FlexBox>
								</MenuItem>
							</IconMenu>
							{playground.isInline &&
							<ButtonTooltip
								placement="bottom-end"
								title={t('common.close-title')}
							>
								<IconButton className="playground_editor-button" onClick={onClose}>
									<Close />
								</IconButton>
							</ButtonTooltip>
							}
						</Fragment>
					</Container>
					<SavePopup
						open={isSavePopupOpen}
						playground={playground}
						onClose={toggleSavePopup}
					/>
					<ConsecutiveSnackbar
						open={playground.isSaving}
						autoHideDuration={playground.isSaving ? null : 1500}
						message={playground.isSaving ? 'Saving...' : t('code_playground.alert.saved-title')}
					/>
				</FlexBox>
			)}
		</Observer>
	);
};

const mapStateToProps = state => ({
	codes: state.userProfile.codes,
});

export default translate()(connect(mapStateToProps)(PlaygroundTabs));
