import React from 'react';
import 'styles/generalLayout.scss';
import Sidebar from 'components/Sidebar';

const Layout = ({
	style,
	children,
	rootStyle,
	noSidebar,
	className,
	sidebarContent,
}) => (
	<div className="layout-container" style={rootStyle}>
		<div className={`main-content ${noSidebar ? 'wide' : ''} ${className}`} style={style}>
			{children}
		</div>
		{!noSidebar &&
		<Sidebar>
			{sidebarContent}
		</Sidebar>
		}
	</div>
);
export default Layout;
