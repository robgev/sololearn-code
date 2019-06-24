import React from 'react';
import MUIMenuItem from '@material-ui/core/MenuItem';

import './styles.scss';

const MenuItem = React.forwardRef(({ className, ...props }, ref) => (
	<MUIMenuItem
		className={`atom_menu-item ${className}`}
		ref={ref}
		classes={{
			selected: 'atom_menu-item_selected',
		}}
		{...props}
	/>
));

export default MenuItem;
