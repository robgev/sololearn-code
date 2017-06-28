//React modules
import React, { Component } from 'react';

import NotificationManager from '../Notifications/NotificationManager';

//Material UI components
import IconButton from 'material-ui/IconButton';
import Badge from 'material-ui/Badge';
import NotificationsIcon from 'material-ui/svg-icons/social/notifications';

const styles = {
}

export default class Actions extends Component {
    constructor(props) {
        super(props);

        this.state = {
            iconIsActive: false
        }
    }

    render() {
        return (
            <div className="actions">
                <NotificationManager />
            </div>
        );
    }
}