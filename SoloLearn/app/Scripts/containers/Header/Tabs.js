import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import tabs from 'constants/Tabs';

// We check if profile is in the url
// If it is menu tabs should not be highlighted at all
// If it is not, we check for possible matches with
// url and aliasUrl
const TabList = ({ pathname, t }) => (
	<div className="tabs">
		{	tabs.map(tab => (
			<Link
				key={tab.id}
				to={tab.url}
				className={`tab-item ${(!pathname.includes('/profile') && (pathname.includes(tab.url) || pathname.includes(tab.aliasUrl))) ? 'active' : ''}`}
			>
				<img className="tab-icon" alt="Tab icon" src={`assets/${tab.imgUrl}`} />
				{ t(tab.name) }
			</Link>
		))
		}
	</div>
);

export default translate()(TabList);
