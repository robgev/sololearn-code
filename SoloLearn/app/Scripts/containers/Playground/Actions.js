// React modules
import React from 'react';

// Material UI components
import Dialog from 'material-ui/Dialog';
import Toggle from 'material-ui/Toggle';
import Snackbar from 'material-ui/Snackbar';
import TextField from 'material-ui/TextField';
import MenuItem from 'material-ui/MenuItem';
import FlatButton from 'material-ui/FlatButton';
import DropDownMenu from 'material-ui/DropDownMenu';

import texts from 'defaults/texts';

const styles = {
	popupContent: {
		width: '50%',
		maxWidth: 'none',
	},

	popupTitle: {
		padding: '15px 15px 0 15px',
		fontSize: '15px',
		fontWeight: 500,
	},

	popupBody: {
		padding: '5px 15px 0 15px',
	},

	popupSubTitle: {
		fontSize: '13px',
		padding: '0px 15px 5px 0px',
	},

	charactersRemaining: {
		textAlign: 'right',
		fontSize: '13px',
	},

	codeStateToggle: {
		width: '95px',
		float: 'right',
		margin: '10px 0',
	},

	thumbOff: {
		backgroundColor: '#E0E0E0',
	},

	trackOff: {
		backgroundColor: '#BDBDBD',
	},

	thumbSwitched: {
		backgroundColor: '#AED581',
	},

	trackSwitched: {
		backgroundColor: '#9CCC65',
	},

	snackbar: {
		textAlign: 'center',
	},
}

const OverlaySaveActions = ({
	isPublic,
	isSaving,
	errorText,
	codeName,
	submitSave,
	openSavePopup,
	snackBarOpened,
	savePopupOpened,
	handleSnackBarClose,
	handleSavePopupClose,
	handleCodeStateChange,
	handleCodeNameChange,
}) => {
	const savePopupActions = [
		<FlatButton
			primary
			label="Submit"
			disabled={!codeName}
			onTouchTap={submitSave}
		/>,
	];

	return (
		<div>
			<Dialog
				modal={false}
				open={savePopupOpened}
				actions={savePopupActions}
				title={texts.savePopupTitle}
				bodyStyle={styles.popupBody}
				titleStyle={styles.popupTitle}
				contentStyle={styles.popupContent}
				onRequestClose={handleSavePopupClose}
			>
					<p style={styles.popupSubTitle}>{texts.savePopupSubTitle}</p>
					<TextField
						id="codeName"
						fullWidth={true}
						maxLength={100}
						hintText={"Code Name:"}
						style={styles.inputStyle}
						value={codeName}
						errorText={errorText}
						onChange={handleCodeNameChange}
					/>
					<p style={styles.charactersRemaining}>{codeName.length}/100</p>
					<Toggle
							label="Public:"
							defaultToggled={isPublic}
							style={styles.codeStateToggle}
							thumbStyle={styles.thumbOff}
							trackStyle={styles.trackOff}
							thumbSwitchedStyle={styles.thumbSwitched}
							trackSwitchedStyle={styles.trackSwitched}
							onToggle={handleCodeStateChange}
					/>
			</Dialog>,
			<Snackbar
					open={snackBarOpened}
					message={isSaving ? "Saving..." : "Saved"}
					style={styles.snackbar}
					autoHideDuration={3000}
					onRequestClose={handleSnackBarClose}
			/>
		</div>
	);
}

export default OverlaySaveActions;
