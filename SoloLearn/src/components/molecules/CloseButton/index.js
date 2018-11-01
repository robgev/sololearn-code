import React from 'react';
import { IconButton } from 'components/atoms';
import { Close } from 'components/icons';

const CloseButton = ({ className, ...props }) => (
	<IconButton className="className" {...props}><Close /></IconButton>
);

CloseButton.defaultProps = {
	className: '',
};

export default CloseButton;
