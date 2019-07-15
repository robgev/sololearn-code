import React from 'react';
import MUITabs from '@material-ui/core/Tabs';

import './styles.scss';

const Tabs = props => (
	<MUITabs
		fullWidth
		classes={{
			root: 'atom_tabs-root',
			indicator: 'atom_tabs-indicator',
		}}
		{...props}
	/>
);

export default Tabs;
