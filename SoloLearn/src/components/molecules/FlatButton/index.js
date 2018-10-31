import React from 'react';
import { Button } from 'components/atoms';

const FlatButton = ({ className, variant, ...props }) => (
	<Button variant="text" className={`molecule_flat_button ${className}`} {...props} />
);

FlatButton.defaultProps = {
	className: '',
	variant: 'text',
};

export default FlatButton;
