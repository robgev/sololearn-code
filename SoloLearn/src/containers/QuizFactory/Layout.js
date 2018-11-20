import React from 'react';
import { LayoutWithSidebar } from 'components/molecules';
import Sidebar from './components/Sidebar';
import './style.scss';

const Layout = props => (
	<LayoutWithSidebar
		sidebar={
			<Sidebar />
		}
		className="quiz_factory"
		{...props}
	/>
);

export default Layout;
