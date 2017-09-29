//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { Link } from 'react-router';
import { TransitionMotion, Motion, spring } from 'react-motion';
let RadiumLink = Radium(Link);

//Additional components
import NotificationList from './NotificationList';

//Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

//Utils
import getStyles from '../../utils/styleConverter';

const styles = {
    container: {
        width: '1000px',
        margin: '20px auto'
    },

    notificationsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '11px 14px'
    },

    notificationsTitle: {
        fontSize: '13px',
        fontWeight: 500
    },

}

class Notifications extends Component {
    render() {
        return (
            <Paper style={styles.container}>
                <div className="notification-header" style={styles.notificationsHeader}>
                    <p className="notifications-title" style={styles.notificationsTitle}>Your Notifications</p>
                </div>
                <Divider />
                <NotificationList isPopup={false} />
            </Paper>
        );
    }
}

export default Radium(Notifications);