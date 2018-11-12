import React, { forwardRef } from 'react';
import MUIMenu from '@material-ui/core/Menu';

const Menu = forwardRef((props, ref) => (
	<MUIMenu ref={ref} {...props} MenuListProps={{ disablePadding: true }} />
));

export default Menu;
