import React from 'react';
import { Link } from 'react-router';
import { translate } from 'react-i18next';
import tabs from 'constants/Tabs';

const isActiveRoute = (pathName, tab) => {
	const sectionName = `/${pathName.split('/')[1]}`;
	return sectionName === tab.url || sectionName === tab.aliasUrl;
};

// We check if profile is in the url
// If it is menu tabs should not be highlighted at all
// If it is not, we check for possible matches with
// url and aliasUrl
const TabList = ({ pathname, t }) => (
	<div className="tabs">
		{tabs.map(tab => (
			<Link
				key={tab.id}
				to={tab.url}
				onClick={pathname === '/discuss' && tab.url === '/discuss' ? e => e.preventDefault() : () => { }}
				className={`tab-item ${(!pathname.includes('/profile') && isActiveRoute(pathname, tab)) ? 'active' : ''}`}
			>
				<img className="tab-icon" alt="Tab icon" src={`/assets/${tab.imgUrl}`} />
				<span>{t(tab.name)}</span>
			</Link>
		))
		}
	</div >
);

export default translate()(TabList);
