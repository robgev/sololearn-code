//React modules
import React, { Component } from 'react';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { markReadInternal } from '../../actions/profile';

//Material UI components
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';

//Utils And Defaults
import types from '../../defaults/appTypes';
import updateDate from '../../utils/dateFormatter';
import getStyles from '../../utils/styleConverter';

const styles = {
    notificationItem: {
    },

    notificationItemInner: {
        padding: '10px'
    },

    notificationContent: {
        display: 'flex'
    },

    additionalDetails: {
        width: '90%',
        margin: '0 0 0 5px',
        color: '#777'
    },

    avatar: {

    },

    badge: {
        base: {
            height: '30px',
            width: '30px',
            borderRadius: '50%',
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center'
        },

        icon: {
            height: '15px',
            width: '15px',
        }
    },

    date: {
        fontSize: '11px'
    },

    title: {
        fontSize: '13px',
        zIndex: 1000000
    },

    userName: {
        textDecoration: 'none'
    },

    notClickedIcon: {
        width: '6px',
        height: '6px',
        backgroundColor: '#607d8b',
        verticalAlign: 'middle',
        display: 'inline-block',
        borderRadius: '50%',
        margin: '0 0 0 5px'
    }
}

class NotificationItem extends Component {
    handleClick = () => {
        const notification = this.props.notification;
        let ids = [notification.id];

        if (notification.groupedItems.length > 1) {
            notification.groupedItems.forEach((item) => {
                if (!item.isClicked) ids.push(item.id);
            });
        }

        this.props.markRead(ids);
    }

    getTitleUser = (title, pattern) => {
        const notification = this.props.notification;
        let href = "/profile/" + notification.actionUser.id;
        return title.replace(pattern, '<a href=' + href + ' style="text-decoration:none;color:#8BC34A;font-weight:500;">' + notification.actionUser.name + "</a>");
    }

    generateContent = () => {
        const notification = this.props.notification;
        let notificationTitle = notification.groupedItems.length > 1 ? notification.message : notification.title;

        if (notificationTitle.includes("{action_user}")) {
            notificationTitle = this.getTitleUser(notificationTitle, "{action_user}");
        }
        if (notificationTitle.includes("{opponent}")) {
            notificationTitle = this.getTitleUser(notificationTitle, "{opponent}");
        }
        if (notificationTitle.includes("{main}")) {
            notificationTitle = this.getTitleUser(notificationTitle, "{main}");
        }
        if (notificationTitle.includes("{other}")) {
            notificationTitle = notificationTitle.replace("{other}", notification.groupedItems.length);
        }

        return (
            <div className="notification-content" style={styles.notificationContent}>
                {
                    notification.type == types.badgeUnlocked ?
                        <div style={getStyles(styles.badge.base, { backgroundColor: notification.achievement.color })}>
                            <img style={styles.badge.icon} src={notification.achievement.icon} />
                        </div>
                        :
                        <Avatar size={30} style={styles.avatar}>{notification.actionUser.name.charAt(0).toUpperCase()}</Avatar>
                }
                <div className="additional-details" style={styles.additionalDetails}>
                    <p className="title" style={styles.title} dangerouslySetInnerHTML={{ __html: notificationTitle }}></p>
                    <div>
                        <span className="date" style={styles.date}>{updateDate(notification.date)}</span>
                        {!notification.isClicked && <span style={styles.notClickedIcon}></span> }
                    </div>
                </div>
            </div>
        );
    }

    render() {
        return (
            <ListItem className="notification-item" containerElement="div" innerDivStyle={styles.notificationItemInner} style={styles.notificationItem} onClick={this.handleClick}>
                {this.generateContent()}
            </ListItem>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return this.props.notification.isClicked !== nextProps.notification.isClicked;
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        markRead: markReadInternal
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(NotificationItem);