import React from 'react';
import 'styles/generalLayout.scss';

const Layout = ({ children, className }) => (
	<div className="layout-container">
		<div className={`main-content ${className}`}>
			{children}
		</div>
		<div className="sidebar" />
	</div>
);
export default Layout;
