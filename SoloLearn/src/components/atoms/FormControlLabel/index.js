import React from 'react';
import MUIFormControlLabel from '@material-ui/core/FormControlLabel';

const FormControlLabel = props => (
	<MUIFormControlLabel {...props} />
);

FormControlLabel.defaultProps = {
	labelPlacement: 'left',
};

export default FormControlLabel;
