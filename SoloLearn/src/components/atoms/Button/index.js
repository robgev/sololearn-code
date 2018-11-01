import React from 'react';
import Button from '@material-ui/core/Button';

const ButtonWrapper = ({ className, variant, ...props }) => (
	<Button variant={variant} className={`atom_button ${className}`} {...props} />
);

ButtonWrapper.defaultProps = {
	className: '',
};

export default ButtonWrapper;
