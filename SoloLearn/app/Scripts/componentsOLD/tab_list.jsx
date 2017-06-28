import React from 'react';
import TabListItem from './tab_list_item';

const TabList = (props) => {
    const tabItems = props.tabs.map((tab) => {
        return (
          <TabListItem
            onTabChange={props.onTabChange}
            id={tab.id}
            key={tab.id}
            url={tab.url}
            name={tab.name}
            isCurrent={(props.selectedTab === tab.id)} />
        );
    });

    return (
      <ul className="tab-list nav nav-tabs">
        {tabItems}
      </ul>
    );
}

export default TabList;