import React from 'react';
import { Title } from 'components/atoms';

import './styles.scss';

const TitleTab = ({ tabs, activeTab, handleTabChange }) => (
	tabs.map(tab => (
		<Title
			className={`sub-title ${activeTab === tab.value ? 'active' : ''}`}
			onClick={() => handleTabChange(tab.value)}
		>
			{tab.text}
		</Title>
	))
);

TitleTab.defaultProps = {
	tabs: [],
	handleTabChange: () => {},
};

export default TitleTab;
