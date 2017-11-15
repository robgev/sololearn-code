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

	sourceFilter: {
		display: 'block',
		width: '150px',
		margin: '0 auto',
	},
}

const OverlayExecutionActions = ({
	sourceUrl,
	selectedSource,
	addExternalSource,
	handleSourceUrlChange,
	externalSourcesPopupOpened,
	handleExternalResourceChange,
	handleExternalSourcesPopupClose,
}) => {
	const libraryPopupActions = [
		<FlatButton
			primary
			label="Add"
			disabled={!sourceUrl.length}
			onTouchTap={addExternalSource}
		/>,
	];

	return (
		<Dialog
			modal={false}
			titleStyle={styles.popupTitle}
			bodyStyle={styles.popupBody}
			actions={libraryPopupActions}
			contentStyle={styles.popupContent}
			open={externalSourcesPopupOpened}
			title={texts.externalSourcePopupTitle}
			onRequestClose={handleExternalSourcesPopupClose}
		>
			<p style={styles.popupSubTitle}>{texts.externalSourcePopupSubTitle}</p>
			<DropDownMenu
				value={selectedSource}
				style={styles.sourceFilter}
				onChange={handleExternalResourceChange}
			>
				<MenuItem value="none" primaryText="None" />
				<MenuItem value="jquery" primaryText="jQuery" />
				<MenuItem value="jqueryui" primaryText="jQuery UI" />
			</DropDownMenu>
			<TextField
				fullWidth
				id="inputs"
				maxLength={100}
				value={sourceUrl}
				hintText="External resource url"
				disabled={selectedSource !== 'none'}
				onChange={handleSourceUrlChange}
			/>
		</Dialog>
	);
}

export default OverlayExecutionActions;
