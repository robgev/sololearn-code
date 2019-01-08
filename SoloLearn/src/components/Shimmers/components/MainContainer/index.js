import React from 'react';
import { Container } from 'components/atoms';
import './styles.scss';

const Line = ({ className, children }) => (
	<Container className={`shimmer_main-container ${className}`}>
		{children}
		<Container className="shimmer_animation" />
	</Container>
);

export default Line;
