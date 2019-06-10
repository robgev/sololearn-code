import React from 'react';
import { Button } from 'components/atoms';

const RaisedButton = ({
	className, autoFocus, variant, ...props
}) => (
	<Button
		variant="contained"
		className={`molecule_flat_button ${className}`}
		action={
			actions => autoFocus && actions.focusVisible()
		}
		{...props}
	/>
);

RaisedButton.defaultProps = {
	className: '',
	variant: 'contained',
	autoFocus: false,
};

export default RaisedButton;
