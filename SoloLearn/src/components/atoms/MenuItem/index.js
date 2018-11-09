import React from 'react';
import MUIMenuItem from '@material-ui/core/MenuItem';

const MenuItem = React.forwardRef((props, ref) => (
	<MUIMenuItem ref={ref} {...props} />
));

export default MenuItem;
