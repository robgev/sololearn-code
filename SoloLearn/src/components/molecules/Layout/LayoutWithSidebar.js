import React from 'react';
import PropTypes from 'prop-types';
import { Container, PaperContainer } from 'components/atoms';
import { StickySidebar } from 'components/molecules';
import Layout from './Layout';

import './styles.scss';

const LayoutWithSidebar = ({
	paper = true, sidebar, sidebarProps, ...props
}) => {
	const SidebarContainer = paper ? PaperContainer : Container;
	return (
		<Layout className="with-sidebar">
			<Container {...props} />
			<StickySidebar>
				<SidebarContainer className="sidebar" {...sidebarProps}>
					{sidebar}
				</SidebarContainer>
			</StickySidebar>
		</Layout>
	);
};

LayoutWithSidebar.defaultProps = {
	sidebarProps: {},
};

LayoutWithSidebar.propTypes = {
	sidebar: PropTypes.element.isRequired,
	sidebarProps: PropTypes.object,
};

export default LayoutWithSidebar;
