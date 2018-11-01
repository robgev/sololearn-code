import React from 'react';
import MUIButton from '@material-ui/core/Button';

const Button = ({ className, variant, ...props }) => (
	<MUIButton variant={variant} className={`atom_button ${className}`} {...props} />
);

Button.defaultProps = {
	className: '',
};

export default Button;
