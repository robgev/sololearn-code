import React from 'react';
import MUITab from '@material-ui/core/Tab';

const Tab = ({ ...props }) => (
	<MUITab classes={{ root: 'atom_tab' }} {...props} />
);

export default Tab;
