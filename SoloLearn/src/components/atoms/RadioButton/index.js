import React from 'react';
import Radio from '@material-ui/core/Radio';

const RadioButton = ({ ...props }) =>
	<Radio {...props} />;

RadioButton.defaultProps = {
	className: '',
};
export default RadioButton;
