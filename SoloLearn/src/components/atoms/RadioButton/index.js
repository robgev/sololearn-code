import React from 'react';
import { RadioButton as Radio } from 'material-ui/RadioButton';

const RadioButton = ({ className, ...props }) =>
	<Radio className={'atom_radio-button ' + className} {...props} />;

RadioButton.defaultProps = {
	className: '',
};
export default RadioButton;