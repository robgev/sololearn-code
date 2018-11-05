import React from 'react';
import MUISnackbar from '@material-ui/core/Snackbar';

// I think we also need to force autoHideDuration

const Snackbar = ({ message, ...props }) => (
	<MUISnackbar
		ContentProps={{
			'aria-describedby': 'message-id',
		}}
		message={<span id="message-id">{message}</span>}
		{...props}
	/>
);

export default Snackbar;
