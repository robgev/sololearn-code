import React from 'react';
import { Title } from 'components/atoms';

import './styles.scss';

const TitleTab = ({
	tabs, activeTab, handleTabChange, className,
}) => (
	tabs.map(tab => (
		<Title
			key={tab.value}
			className={`molecule_title-tab_sub-title ${className} ${activeTab === tab.value ? 'active' : ''}`}
			onClick={() => handleTabChange(tab.value)}
		>
			{tab.text}
		</Title>
	))
);

TitleTab.defaultProps = {
	tabs: [],
	handleTabChange: () => {},
	className: '',
};

export default TitleTab;
