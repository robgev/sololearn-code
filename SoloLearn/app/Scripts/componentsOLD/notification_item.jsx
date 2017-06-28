import React, { Component } from 'react';

class NotificationItem extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        return (
            <div className="notification-item">
                {this.props.name}
            </div>
        );
    }
}

export default NotificationItem;