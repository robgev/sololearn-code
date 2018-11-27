import React from 'react';
import MUICheckbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextBlock } from 'components/atoms';

const Checkbox = ({ label, labelPlacement, ...props }) => (
	<FormControlLabel
		control={<MUICheckbox {...props} />}
		label={<TextBlock>{label}</TextBlock>}
		labelPlacement={labelPlacement}
	/>
);

Checkbox.defaultProps = {
	label: '',
	labelPlacement: 'start',
};

export default Checkbox;
