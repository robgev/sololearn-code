import React from 'react';
import IconButton from '@material-ui/core/IconButton';

const IconButtonWrapper = ({ className, ...props }) => (
	<IconButton className={`atom_icon_button ${className}`} {...props} />
);

IconButtonWrapper.defaultProps = {
	className: '',
};

export default IconButtonWrapper;
