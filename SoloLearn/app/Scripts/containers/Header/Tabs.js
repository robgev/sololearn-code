import React from 'react';
import { Link } from 'react-router';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import { Tabs, Tab } from 'material-ui/Tabs';
import selectTab from 'actions/tabs';

const TabList = ({ tabs, activeTabId }) => (
	<Tabs
		className="tabs"
		value={activeTabId}
	>
		{	tabs.map(tab => (
			<Tab
				key={tab.id}
				value={tab.id}
				label={tab.name}
				className="tab-item"
				containerElement={<Link to={tab.url} />}
				onClick={() => this.props.selectTab(tab)}
			/>
		))
		}
	</Tabs>
);

function mapStateToProps(state) {
	return {
		tabs: state.tabs,
		activeTabId: !state.activeTab ? 1 : state.activeTab.id,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({ selectTab }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(TabList);
