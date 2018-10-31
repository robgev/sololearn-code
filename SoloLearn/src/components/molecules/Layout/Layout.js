import React from 'react';
import { Container } from 'components/atoms';

import './styles.scss';

const Layout = ({ className, ...props }) => (
	<Container className={`molecule_layout ${className}`} {...props} />
);

Layout.defaultProps = {
	className: '',
};

export default Layout;
