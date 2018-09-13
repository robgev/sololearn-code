import React from 'react';
import GeneralLayout from 'components/Layouts/GeneralLayout';

const Layout = props => (
	<GeneralLayout
		sidebarContent={
			<div>
				Quiz Factory Guidelines
			</div>
		}
		{...props}
	/>
);

export default Layout;
