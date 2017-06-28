//React modules
import React, { Component } from 'react';
import { Link } from 'react-router';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { selectTab } from '../../actions/tabs';

//Material UI components
import {Tabs, Tab} from 'material-ui/Tabs';

class TabList extends Component {
    constructor(props) {
        super(props);

        this.handleClick = this.handleClick.bind(this);
    }

    renderList() {
        return this.props.tabs.map((tab) => {
            return (
                <Tab label={tab.name} containerElement={<Link to={tab.url} />} key={tab.id}
                     onClick={() => this.handleClick(tab)} className="tab-item">
                </Tab>
            );
        });
    }

    handleClick(tab) {
        this.props.selectTab(tab);
    }

    render() {
        return (
            <Tabs className="tabs">
                {this.renderList()}
            </Tabs>
        );
    }
}

function mapStateToProps(state) {
    return {
        tabs: state.tabs,
        activeTabId: !state.activeTab ? 1 : state.activeTab.id
    };
}

//Anything returned from this function will end up as props on TabList container
function mapDispatchToProps(dispatch) {
    //Whenever selectTab is called, the result should be passed to all of our reducers
    return bindActionCreators({ selectTab: selectTab }, dispatch);
}

//Promote TabList from a component to container - it need to know about this new dispatch method, selectTab. 
//Make it available as prop.
export default connect(mapStateToProps, mapDispatchToProps)(TabList);