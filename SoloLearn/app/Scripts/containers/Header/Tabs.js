import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import tabs from 'constants/Tabs';

const TabList = ({ pathname, t }) => (
	<div className="tabs">
		{	tabs.map(tab => (
			<Link
				key={tab.id}
				to={tab.url}
				className={`tab-item ${pathname.includes(tab.url) || pathname.includes(tab.aliasUrl) ? 'active' : ''}`}
			>
				<img className="tab-icon" alt="Tab icon" src={`assets/${tab.imgUrl}`} />
				{ t(tab.name) }
			</Link>
		))
		}
	</div>
);

export default translate()(TabList);
