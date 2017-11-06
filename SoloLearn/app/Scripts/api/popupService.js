// React modules
import React, { Component } from 'react';

// Material UI components
import Dialog from 'material-ui/Dialog';
import Paper from 'material-ui/Paper';
import FlatButton from 'material-ui/FlatButton';
import RaisedButton from 'material-ui/RaisedButton';
import CorrectIcon from 'material-ui/svg-icons/action/done';
import WrongIcon from 'material-ui/svg-icons/content/clear';
import { lightGreen500, red600 } from 'material-ui/styles/colors';

// Utils
import getStyles from '../utils/styleConverter';

// App texts
import texts from '../defaults/texts';

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
		zIndex: 10000,
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
				onTouchTap={button.actionCallback}
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

	// openQuizComments(e, openComments) {
	//    e.preventDefault();

	//    openComments();
	// }
	// <FlatButton label="COMMENTS" onClick={(e) => {this.openQuizComments(e, openComments)}} />

	popupClick(isCorrect, isCheckpoint, actionCallback) {
		if (!isCorrect && !isCheckpoint) return;

		actionCallback();
	}

	checkPopup(isCorrect, actionCallback, isCheckpoint) { // openComments
		return (
			<div className="check-popup-overlay" style={styles.checkPopupOverlay}>
				<Paper zDepth={2} className="check-popup" style={!isCorrect ? styles.checkPopup.base : getStyles(styles.checkPopup.base, styles.checkPopup.clickable)} onClick={() => { this.popupClick(isCorrect, isCheckpoint, actionCallback); }}>
					{ isCorrect ?
						[ <CorrectIcon key="correctIcon" color={lightGreen500} style={styles.icon} />,
							<p key="correctText" style={getStyles(styles.text.base, styles.text.correct)}>Correct!</p> ]
						:
						[ <WrongIcon key="wrongIcon" color={red600} style={styles.icon} />,
							<p key="wrongText" style={getStyles(styles.text.base, styles.text.wrong)}>Wrong</p>,
							isCheckpoint && <RaisedButton key="backToTextButton" label="Back" primary style={styles.backButton} labelStyle={styles.backButtonLabel} onClick={actionCallback} /> ]
					}
				</Paper>
			</div>
		);
	}
}

const Popup = new PopupService();

export default Popup;
