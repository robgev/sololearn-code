import React from 'react';
import { Container } from 'components/atoms';

import './styles.scss';

const IconWithText = ({ Icon, children }) => (
	<Container className="molecule_icon-with-text">
		<Icon className="icon" />
		{children}
	</Container>
);

export default IconWithText;
