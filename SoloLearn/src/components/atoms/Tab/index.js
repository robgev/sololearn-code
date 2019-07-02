import React from 'react';
import MUITab from '@material-ui/core/Tab';
import './styles.scss';

const Tab = props => (
	<MUITab
		classes={{
			root: 'atom_tab',
			selected: 'atom_tab-selected',
			wrapper: 'atom_tab-wrapper',
		}}
		{...props}
	/>
);

export default Tab;
