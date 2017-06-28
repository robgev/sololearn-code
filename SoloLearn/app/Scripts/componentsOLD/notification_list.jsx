import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import NotificationItem from './notification_item';

class NotificationList extends Component {
    constructor(props) {
        super(props);


        this.state = {   
            items : [
                { id: 1, name: 'Item 1'},
                { id: 2, name: 'Item 2'},
                { id: 3, name: 'Item 3'},
                { id: 4, name: 'Item 4'},
                { id: 5, name: 'Item 5'},
                { id: 6, name: 'Item 6'},
                { id: 7, name: 'Item 7'},
                { id: 8, name: 'Item 8'},
                { id: 9, name: 'Item 9'},
                { id: 10, name: 'Item 10'},
                { id: 11, name: 'Item 11'},
                { id: 12, name: 'Item 12'},
                { id: 13, name: 'Item 13'},
                { id: 14, name: 'Item 14'},
                { id: 15, name: 'Item 15'}
            ],
            isOpened: false,
            isLoading: false
        };

        this.handleScroll = this.handleScroll.bind(this);
    }

    loadMoreItems() {
        var itemsToAdd = 5;
        var secondsToWait = 2;
        this.setState({ isLoading: true });
        var $notificationItems = ReactDOM.findDOMNode(this.refs.notificationBody);
        $notificationItems.className = "notifications-body notification-items loading";
        // fake an async. ajax call with setTimeout
        //window.setTimeout(function() {
        // add data
        var currentItems = this.state.items;
        var itemsLength = currentItems.length;
        for (var i = 1; i <= itemsToAdd; i++) {
            var currentId = itemsLength + i;
            var item = {
                id: currentId,
                name: 'Item' + currentId
            }
            currentItems.push(item);
        }
        this.setState({
            items: currentItems,
            isLoading: false
        });
        $notificationItems.className = "notifications-body notification-items";
        //}.bind(this), secondsToWait * 1000);
    }
  
    renderItems() {
        const notificationItems = this.state.items.map((item) => {
            return (
                <NotificationItem
                    key={item.id}
                    name={item.name} 
                />
            );
        });

        return notificationItems;
    }

    componentDidMount() {
        var scollingArea = ReactDOM.findDOMNode(this.refs.notificationBody);
        scollingArea.addEventListener('scroll', this.handleScroll);
        document.addEventListener('click', this.handleDocumentClick);
    }
    
    componentWillUnmount() {
        var scollingArea = ReactDOM.findDOMNode(this.refs.notificationBody);
        scollingArea.removeEventListener('scroll', this.handleScroll);
        document.addEventListener('click', this.handleDocumentClick);
    }

    handleScroll() {
        var scollingArea = ReactDOM.findDOMNode(this.refs.notificationBody);
        if(scollingArea.scrollTop === (scollingArea.scrollHeight - scollingArea.offsetHeight))
        {
            if(!this.state.isLoading) {
                this.loadMoreItems();
            }
        }
    }

    handleClick(event) {
        this.setState({
            isOpened: !this.state.isOpened
        });
    }

    /* using fat arrow to bind to instance */
    handleDocumentClick = (event) => {
        const notificationsArea = ReactDOM.findDOMNode(this.refs.notifications);

        if (!notificationsArea.contains(event.target) && this.state.isOpened) {
            this.setState({
                isOpened: false
            });
        }
    }

    render() {
        return (
            <div className={this.state.isOpened ? 'notifications opened' : 'notifications'} ref="notifications">
                <img src={this.props.iconPath} onClick={ event => this.handleClick(event) } />
                <div className="notification-container" ref="notificationContainer">
                    <div className="notification-title">Notifications</div>
                    <div className="notifications-body notification-items" ref="notificationBody">
                        {this.renderItems()}
                        <div className="loader">
                            <svg className="material-spinner">
                                <circle className="path" cx="25" cy="25" r="12" fill="none" strokeWidth="3" strokeMiterlimit="10"></circle>
                            </svg>
                        </div>
                    </div>
                    <div className="notification-footer">
                        <a href="#">See All</a>
                    </div>
                </div>
            </div>
        );
    }
}

export default NotificationList;