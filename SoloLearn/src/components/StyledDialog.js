import React from 'react';
import Dialog from 'material-ui/Dialog';

const StylesDialog = ({ contentStyle, ...rest }) =>
	<Dialog contentStyle={{ maxWidth: 'none', width: '40%', ...contentStyle }} {...rest} />;

StylesDialog.defaultProps = {
	contentStyle: {},
};

export default StylesDialog;
