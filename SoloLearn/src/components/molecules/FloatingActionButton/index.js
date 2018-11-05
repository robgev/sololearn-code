import React from 'react';
import { Button, Container } from 'components/atoms';

// Note, when using this, please set position: relative to the container
// you want to have the button in.
// Also, set z-index: 1 to all elements that should be under button.

const FloatingActionButton = ({ alignment, className, ...props }) => (
	<Container className={`molecule_fab ${alignment} ${className}`}>
		<Button
			variant="fab"
			color="secondary"
			classes={{ root: 'molecule_fab-button-root' }}
			{...props}
		/>
	</Container>
);

FloatingActionButton.defaultProps = {
	className: '',
	variant: 'text',
};

export default FloatingActionButton;
