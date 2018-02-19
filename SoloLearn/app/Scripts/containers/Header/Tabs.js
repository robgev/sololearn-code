import React from 'react';
import { Link } from 'react-router';
import tabs from 'constants/Tabs';

const TabList = ({ pathname }) => (
	<div className="tabs">
		{	tabs.map(tab => (
			<Link
				key={tab.id}
				to={tab.url}
				className={`tab-item ${pathname.includes(tab.url) || pathname.includes(tab.aliasUrl) ? 'active' : ''}`}
			>
				<img className="tab-icon" alt="Tab icon" src={`assets/${tab.imgUrl}`} />
				{ tab.name }
			</Link>
		))
		}
	</div>
);

export default TabList;
