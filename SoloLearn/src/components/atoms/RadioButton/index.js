import React from 'react';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextBlock } from 'components/atoms';

const RadioButton = ({ label, labelPlacement, ...props }) => (
	<FormControlLabel
		control={<Radio {...props} />}
		label={<TextBlock>{label}</TextBlock>}
		labelPlacement={labelPlacement}
	/>
);

RadioButton.defaultProps = {
	label: '',
	labelPlacement: 'start',
};

export default RadioButton;
