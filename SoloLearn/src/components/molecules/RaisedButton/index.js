import React from 'react';
import { Button } from 'components/atoms';

import './styles.scss';

const RaisedButton = ({
	className, autoFocus, variant, ...props
}) => (
	<Button
		variant="contained"
		className={`molecule_raised_button ${className}`}
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
