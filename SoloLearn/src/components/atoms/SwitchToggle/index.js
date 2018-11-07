import React from 'react';
import Switch from '@material-ui/core/Switch';
import './styles.scss';

const SwitchToggle = props => (
	<Switch 
		classes={{
			root: 'atom_switch',
			switchBase: 'atom_switch_base',
			iconChecked: 'atom_switch_checked',
			bar: 'atom_switch_bar',
		}} 
		{...props} 
	/>
);

export default SwitchToggle;
