//React modules
import React, { Component } from 'react';

//Additional data and components
import Followers from './Followers';
import Following from './Following';

//Material UI components
import { Tabs, Tab } from 'material-ui/Tabs';
import IconButton from 'material-ui/IconButton';
import Close from 'material-ui/svg-icons/content/clear';
import { grey600 } from 'material-ui/styles/colors';

//Utils
import getStyles from '../../utils/styleConverter';
import EnumNameMapper from '../../utils/enumNameMapper';

const TabTypes = {
    Followers: 1,
    Following: 2
}
EnumNameMapper.apply(TabTypes);

const styles = {
    container: {
        position: 'relative',
    },

    header: {
        display: 'flex'
    },

    tabsWrapper: {
        flex: 1
    },

    tabs: {
        backgroundColor: '#fff'
    },

    tab: {
        color: 'rgba(107, 104, 104, 0.8)'
    },


    inkBarStyle: {
        backgroundColor: '#777'
    },

    close: {
        button: {
            width: '40px',
            height: '40px',
            padding: '10px'
        },

        icon: {
            width: '20px',
            height: '20px'
        }
    }
}

class FollowersBase extends Component {
    constructor(props) {
        super(props);

        this.state = {
            activeTab: TabTypes.Followers
        }
    }

    handleTabChange(value) {
        this.setState({ activeTab: value });
    }

    render() {
        const userId = this.props.userId;

        return (
            <div id="followers-base" style={styles.container}>
                <div style={styles.header}>
                    <Tabs value={this.state.activeTab} style={styles.tabsWrapper} tabItemContainerStyle={styles.tabs} inkBarStyle={styles.inkBarStyle}>
                        <Tab label="Followers"
                            value={TabTypes.Followers}
                            style={styles.tab}
                            onClick={() => this.handleTabChange(TabTypes.Followers)} />
                        <Tab label="Following"
                            value={TabTypes.Following}
                            style={styles.tab}
                            onClick={() => this.handleTabChange(TabTypes.Following)} />
                    </Tabs>
                    <IconButton className="close" style={styles.close.button} iconStyle={styles.close.icon} onClick={() => this.props.closePopup()}>
                        <Close color={grey600} />
                    </IconButton>
                </div>
                {this.state.activeTab == TabTypes.Followers && <Followers userId={userId} />}
                {this.state.activeTab == TabTypes.Following && <Following userId={userId} />}
            </div>
        );
    }
}

export default FollowersBase;