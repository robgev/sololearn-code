import React from 'react';
import PropTypes from 'prop-types';
import { Container, PaperContainer } from 'components/atoms';
import Layout from './Layout';

import './styles.scss';

const LayoutWithSidebar = ({ sidebar, sidebarProps, ...props }) => (
	<Layout className="with-sidebar">
		<Container {...props} />
		<PaperContainer className="sidebar" {...sidebarProps}>
			{sidebar}
		</PaperContainer>
	</Layout>
);

LayoutWithSidebar.defaultProps = {
	sidebarProps: {},
};

LayoutWithSidebar.propTypes = {
	sidebar: PropTypes.element.isRequired,
	sidebarProps: PropTypes.object,
};

export default LayoutWithSidebar;
