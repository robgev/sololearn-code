import React from 'react';
import TextField from '@material-ui/core/TextField';

import './styles.scss';

const Input = ({ InputProps, ...props }) => (
	<TextField
		{...props}
		InputProps={{ classes: { underline: 'atom_input_underline' }, ...InputProps }}
		InputLabelProps={{ FormLabelClasses: { root: 'atom_input_label', focused: 'atom_input_label_focused' } }}
	/>
);
Input.defaultProps = {
	InputProps: {},
};

export default Input;
