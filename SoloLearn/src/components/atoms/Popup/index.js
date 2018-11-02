import React from 'react';
import Dialog from '@material-ui/core/Dialog';

const Popup = props => (
	<Dialog
		aria-labelledby="alert-dialog-title"
		aria-describedby="alert-dialog-description"
		{...props}
	/>
);

export default Popup;
