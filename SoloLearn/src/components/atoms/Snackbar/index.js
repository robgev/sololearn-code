import React from 'react';
import MUISnackbar from '@material-ui/core/Snackbar';

const Snackbar = ({ message, snackKey, ...props }) => (
	<MUISnackbar
		ContentProps={{
			'aria-describedby': 'message-id',
		}}
		message={<span id="message-id">{message}</span>}
		{...props}
	/>
);

Snackbar.defaultProps = {
	autoHideDuration: 1500,
};

export default Snackbar;
