import React from 'react';
import PropTypes from 'prop-types';
import { Container, PaperContainer } from 'components/atoms';
import { StickySidebar } from 'components/molecules';
import Layout from './Layout';

import './styles.scss';

const LayoutWithSidebar = ({ sidebar, sidebarProps, ...props }) => (
	<Layout className="with-sidebar">
		<Container {...props} />
		<StickySidebar>
			<PaperContainer className="sidebar" {...sidebarProps}>
				{sidebar}
			</PaperContainer>
		</StickySidebar>
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
