import React from 'react';
import TextField from '@material-ui/core/TextField';
import './styles.scss';

const Input = ({ InputProps, ...props }) =>
	(<TextField
		InputProps={{
			classes: {
           		underline: 'underline',
          	},
			...InputProps,
		}}
		classes={{
			root: 'atom_input',
		}}
		{...props}
	/>);

Input.defaultProps = {
	InputProps: {},
};
export default Input;
