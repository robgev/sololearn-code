import React from 'react';
import { Button } from 'components/atoms';

const RaisedButton = ({ className, variant, ...props }) => (
	<Button variant="contained" className={`molecule_flat_button ${className}`} {...props} />
);

RaisedButton.defaultProps = {
	className: '',
	variant: 'contained',
};

export default RaisedButton;
