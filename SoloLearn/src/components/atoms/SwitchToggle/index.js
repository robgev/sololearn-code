import React from 'react';
import Switch from '@material-ui/core/Switch';

import './styles.scss';

const SwitchToggle = ({ ...props }) =>
	(<Switch
		classes={{
			root: 'atom_switch-toggle', checked: 'atom_switch-toggle-checked', bar: 'atom_switch-toggle-bar', switchBase: 'atom_switch-toggle_base',
		}}
		color="default"
		{...props}
	/>);

export default SwitchToggle;
