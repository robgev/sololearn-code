import React from 'react';
import { Container } from 'components/atoms';
import Header from 'containers/Header/Header';

import './styles.scss';

const MainLayout = ({ children, location: { pathname } }) => (
	<Container>
		<Header pathname={pathname} />
		<Container className="main-layout_content-container">
			{children}
		</Container>
	</Container>
);

export default MainLayout;
