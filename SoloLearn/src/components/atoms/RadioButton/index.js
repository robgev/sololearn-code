import React from 'react';
import Radio from '@material-ui/core/Radio';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import { TextBlock } from 'components/atoms';

const RadioButton = ({label, ...props}) => (
	<FormControlLabel
		value="left"
		control={<Radio {...props} />}
		label={<TextBlock>{label}</TextBlock>}
		labelPlacement="left"
	/>
	
);

export default RadioButton;
