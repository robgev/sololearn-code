import React from 'react';
import Divider from '@material-ui/core/Divider';

const HorizontalDivider = ({ className, ...props }) =>
	<Divider light classes={{ root: `atom_horizontal-divider ${className}` }} {...props} />;

HorizontalDivider.defaultProps = {
	className: '',
};
export default HorizontalDivider;
