import React from 'react';
import { Button } from 'components/atoms';

import './styles.scss';

const FlatButton = ({
	className, variant, autoFocus, ...props
}) => (
	<Button
		variant="text"
		action={
			actions => autoFocus && actions.focusVisible()
		}
		className={`molecule_flat_button ${className}`}
		{...props}
	/>
);

FlatButton.defaultProps = {
	className: '',
	variant: 'text',
	autoFocus: false,
};

export default FlatButton;
