import React from 'react';
import { translate } from 'react-i18next';
import { Container, Image, TextBlock } from 'components/atoms';
import { ContainerLink } from 'components/molecules';
import tabs from 'constants/Tabs';
import './styles.scss';

const isActiveRoute = (pathName, tab) => {
	const sectionName = `/${pathName.split('/')[1]}`;
	return sectionName === tab.url || sectionName === tab.aliasUrl;
};

// We check if profile is in the url
// If it is menu tabs should not be highlighted at all
// If it is not, we check for possible matches with
// url and aliasUrl
const TabList = ({ pathname, t }) => (
	<Container className="header_tabs">
		{tabs.map((tab) => {
			const isActive = !pathname.includes('/profile') && isActiveRoute(pathname, tab);
			return (
				<ContainerLink
					key={tab.id}
					to={tab.url}
					className={`header_tab-item ${isActive ? 'active' : ''}`}
				>
					<Image
						alt="Tab icon"
						className="header_tab-icon"
						src={`/assets/${tab.imgUrl}${isActive ? '_selected' : ''}.${tab.imgFormat}`}
					/>
					<span>{t(tab.name)}</span>
				</ContainerLink>
			);
		})}
	</Container>
);

export default translate()(TabList);
