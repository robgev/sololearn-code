import React from 'react';
import 'styles/generalLayout.scss';

const Layout = ({ children, sidebarContent, className }) => (
	<div className="layout-container">
		<div className={`main-content ${className}`}>
			{children}
		</div>
		<div className="sidebar-placeholder">
			<div className="sidebar">
				{sidebarContent}
			</div>
		</div>
	</div>
);
export default Layout;
