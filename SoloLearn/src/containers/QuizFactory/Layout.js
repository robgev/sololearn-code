import React from 'react';
import { LayoutWithSidebar } from 'components/molecules';
import Sidebar from './components/Sidebar';

const Layout = props => (
	<LayoutWithSidebar
		sidebar={
			<Sidebar />
		}
		{...props}
	/>
);

export default Layout;
