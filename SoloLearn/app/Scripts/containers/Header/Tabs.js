// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectTab } from '../../actions/tabs';

// Material UI components
import { Tabs, Tab } from 'material-ui/Tabs';

class TabList extends Component {
    tabList = this.props.tabs.map(tab => (
	<Tab
	key={tab.id}
    		value={tab.id}
	label={tab.name}
	containerElement={<Link to={tab.url} />}
	onClick={() => this.props.selectTab(tab)}
	className="tab-item"
    	/>
    ));
    render() {
    	return (
    		<Tabs
    			className="tabs"
		value={this.props.activeTabId}
	>
    			{this.tabList}
	</Tabs>
    	);
    }
}

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
