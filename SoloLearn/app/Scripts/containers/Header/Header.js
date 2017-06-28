//React modules
import React, { Component } from 'react';

//Additional components
import TabList from './Tabs';
import Actions from './Actions';

const styles = {
    header: {
        backgroundColor: '#607D8B',
        //flex: '0 1 auto'
    }
}

export default class Header extends Component {
    render() {
        return (
            <div className="header" style={styles.header}>
                <Actions />
                <TabList />
            </div>
        );
    }
}