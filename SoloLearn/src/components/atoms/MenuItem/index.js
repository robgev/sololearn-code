import React from 'react';
import MUIMenuItem from '@material-ui/core/MenuItem';

import './styles.scss';

const MenuItem = React.forwardRef((props, ref) => (
	<MUIMenuItem className="atom_menu-item" ref={ref} {...props} />
));

export default MenuItem;
