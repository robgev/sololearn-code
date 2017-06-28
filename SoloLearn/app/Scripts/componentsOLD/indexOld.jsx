import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import { Router, Route, Link, browserHistory } from 'react-router'
import TabList from './components/tab_list';
import Content from './components/content';
import Feed from './components/feed';
import Learn from './components/learn';
import Profile from './components/profile';
import NotificationList from './components/notification_list';

require('./styles/style.css')

class App extends Component {
    constructor(props) {
        super(props);

        this.state = {
            tabs: [
                    { 'id': 1, 'name': 'Feed', 'url': '/feed' },
                    { 'id': 2, 'name': 'Learn', 'url': '/learn' },
                    { 'id': 3, 'name': 'Play', 'url': '/play' },
                    { 'id': 4, 'name': 'Code', 'url': '/code' },
                    { 'id': 5, 'name': 'Discuss', 'url': '/discuss' }
            ],
            selectedTab: 1
        };

        this.changeTab = this.changeTab.bind(this);

        this.changeTab(this.state.tabs[0].id);

        this.logoPath = require('./Images/logo.svg');
        this.notificationIconPath = require('./Images/notification.png');
        this.profileIcon = require('./Images/profile.png');
    }

    changeTab(tab) {
        this.setState({ selectedTab: tab.id });
    }

    render() {
        return (
          <div className="container main">
              <div className="header">
                  <div className="wrapper">
                      <div className="logo">
                        <img src={this.logoPath} onClick={event => this.changeTab(this.state.tabs[0])} />
                      </div>
                      <Profile path={this.profileIcon} />
                      <NotificationList iconPath={this.notificationIconPath} />
                  </div>
                  <TabList 
                    selectedTab={this.state.selectedTab}
                    onTabChange={this.changeTab}
                    tabs={this.state.tabs}
                  />
              </div>
              <Content currentTab={this.state.selectedTab} />
	      </div>
	  );
	}
};

ReactDOM.render(
    <Router history={browserHistory}>
        <Route path='/' component={App}>
            <Route path='feed' component={Feed} />
            <Route path='learn' component={Learn} />
        </Route>
    </Router>,
    document.querySelector('#app')
);