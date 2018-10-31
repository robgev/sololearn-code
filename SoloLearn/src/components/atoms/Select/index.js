import React from 'react';
import Dropdown from '@material-ui/core/Select';
import Input from '@material-ui/core/Input';
import './styles.scss';

const Select = ({ ...props }) =>
	(<Dropdown
		input={
			<Input classes={{
           		underline: 'underline',
          	}}
			/>
		}
		{...props}
	/>);
export default Select;
