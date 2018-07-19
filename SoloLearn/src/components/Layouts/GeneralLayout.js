import React from 'react';
import 'styles/generalLayout.scss';

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
		<div className="sidebar-placeholder">
			<div className="sidebar">
				{sidebarContent}
			</div>
		</div>
		}
	</div>
);
export default Layout;
