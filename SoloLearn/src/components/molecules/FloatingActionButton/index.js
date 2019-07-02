import React from 'react';
import { Button, Container } from 'components/atoms';
import './styles.scss';

// Note, when using this, please set position: relative to the container
// you want to have the button in.

const FloatingActionButton = ({
	alignment,
	className,
	children,
	onClick,
	color,
	...props
}) =>
	(
		<Container className={`molecule_fab ${alignment} ${className}`} {...props}>
			<Button
				onClick={onClick}
				variant="fab"
				color={color}
				classes={{ root: 'molecule_fab-button-root' }}
			>
				{children}
			</Button>
		</Container>
	);

FloatingActionButton.defaultProps = {
	color: 'secondary',
	className: '',
	alignment: '',
	variant: 'text',
};

export default FloatingActionButton;
