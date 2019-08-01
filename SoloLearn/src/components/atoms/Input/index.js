import React from 'react';
import TextField from '@material-ui/core/TextField';

import './styles.scss';

const defaultClasses = {
	underline: 'atom_input_underline',
	focused: 'atom_input_focused',
	disabled: 'atom_input_disabled',
	error: 'atom_input_error',
	root: 'atom_input_root',
	notchedOutline: 'atom_input_outlined',
};
const Input = ({ InputProps, ...props }) => (
	<TextField
		{...props}
		InputProps={{
			...InputProps,
			classes: { ...defaultClasses, ...InputProps.classes },
		}}
		InputLabelProps={{ FormLabelClasses: { root: 'atom_input_label', focused: 'atom_input_label_focused' } }}
	/>
);
Input.defaultProps = {
	InputProps: { classes: {} },
};

export default Input;
