import React from 'react';
import { Link } from 'react-router';

const TabList = ({ tabs }) => (
	<div className="tabs">
		{	tabs.map(tab => (
			<Link key={tab.id} to={tab.url}> { tab.name }</Link>
		))
		}
	</div>
);

export default TabList;
