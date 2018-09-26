// React modules
import React from 'react';

// Material UI components
import Dialog from 'components/StyledDialog';
import Paper from 'material-ui/Paper';
import RaisedButton from 'material-ui/RaisedButton';
import CorrectIcon from 'material-ui/svg-icons/action/done';
import WrongIcon from 'material-ui/svg-icons/content/clear';
import { lightGreen500, red600 } from 'material-ui/styles/colors';

// i18n
import i18n from 'i18n';

// App texts
import texts from 'defaults/texts';

const styles = {
	confirmPopup: {
		zIndex: 10001,
	},

	checkPopupOverlay: {
		position: 'absolute',
		top: 0,
		left: 0,
		height: '100%',
		width: '100%',
		backgroundColor: 'rgba(255, 255, 255, 0.4)',
	},

	checkPopup: {
		base: {
			padding: '10px 15px',
			backgroundColor: '#fff7df',
			position: 'absolute',
			bottom: '20px',
		},

		clickable: {
			cursor: 'pointer',
		},
	},

	icon: {
		display: 'inline-block',
		verticalAlign: 'middle',
	},

	text: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			margin: '0 0 0 10px',

		},

		correct: {
			color: '#8BC34A',
		},

		wrong: {
			color: '#E53935',
		},
	},

	backButton: {
		display: 'inline-block',
		verticalAlign: 'middle',
		margin: '0 0 0 10px',
		minWidth: '50px',
	},

	backButtonLabel: {
		fontSize: '13px',
	},
};

class PopupService {
	constructor() {
		if (!PopupService.instance) {
			PopupService.instance = this;
		}

		return PopupService.instance;
	}

	generatePopupActions(buttons) {
		return buttons.map((button, index) => (
			<button.componentType
				label={(texts[button.label] ? texts[button.label] : '')}
				primary={button.isPrimary}
				onClick={button.actionCallback}
			/>
		));
	}

	getPopup(actions, dialogState, closeCallback, nodes, modal = false) {
		return (
			<Dialog
				actions={actions}
				modal={modal}
				open={dialogState}
				onRequestClose={closeCallback}
				style={styles.confirmPopup}
			>
				{
					nodes.map((node, index) => (texts[node.key] ? texts[node.key] : '').replace('{placeholder}', node.replacemant))
				}
			</Dialog>
		);
	}

	popupClick(isCorrect, isCheckpoint, actionCallback) {
		if (!isCorrect && !isCheckpoint) return;
		actionCallback();
	}

	checkPopup({
		isCorrect,
		isShortcut,
		shortcutLives,
		isCheckpoint,
		commentCount,
		actionCallback,
		openComments,
	}) { // openComments
		return (
			<div className="check-popup-overlay" style={styles.checkPopupOverlay}>
				<Paper
					zDepth={2}
					className="check-popup"
					style={{
						...styles.checkPopup.base,
						...(isCorrect ? styles.checkPopup.clickable : {}),
					}}
				>
					{ isCorrect ?
						[
							<CorrectIcon
								key="correctIcon"
								style={styles.icon}
								color={lightGreen500}
							/>,
							<p
								key="correctText"
								style={{ ...styles.text.base, ...styles.text.correct }}
							>
								{i18n.t('learn.answer-correct')}
							</p>,
						] :
						[
							<WrongIcon
								color={red600}
								key="wrongIcon"
								style={styles.icon}
							/>,
							<p
								key="wrongText"
								style={{ ...styles.text.base, ...styles.text.wrong }}
							>
								{i18n.t('learn.answer-wrong')}
							</p>,
							isCheckpoint &&
							<RaisedButton
								primary
								label="Back"
								key="backToTextButton"
								onClick={actionCallback}
								style={styles.backButton}
								labelStyle={styles.backButtonLabel}
							/>,
							isShortcut &&
								<p>{shortcutLives} {i18n.t('learn.answer-check-attemps-left-format')}</p>,
						]
					}
				</Paper>
			</div>
		);
	}
}

const Popup = new PopupService();

export default Popup;
