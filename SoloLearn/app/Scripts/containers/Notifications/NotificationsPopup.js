//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';
import { Link } from 'react-router';
import { Motion, spring } from 'react-motion';
let RadiumLink = Radium(Link);

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { markReadInternal } from '../../actions/profile';

//Additional components
import NotificationList from './NotificationList';

//Material UI components
import Paper from 'material-ui/Paper';
import Divider from 'material-ui/Divider';

//Utils
import getStyles from '../../utils/styleConverter';

const styles = {
    wrapper: {
        position: 'absolute',
        right: '15px',
        opacity: 0,
        zIndex: 10001
    },

    arrow: {
        position: 'absolute',
        pointerEvents: 'none',
        borderTop: '10px solid transparent',
        borderLeft: '10px solid transparent',
        borderRight: '10px solid transparent',
        borderBottom: '10px solid #fff',
        height: 0,
        width: 0,
        bottom: '100%',
        right: '29px',
        top: 0,
        zIndex: 10001
    },

    notificationsHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '11px 14px'
    },

    notificationsHeaderButton: {
        border: 'none',
        backgroundColor: '#fff',
        outline: 'none',
        color: '#607d8b',
        cursor: 'pointer',

        //':hover': {
        //    textDecoration: 'underline'
        //}
    },

    notificationsTitle: {
        fontSize: '13px',
        fontWeight: 500
    },

    notificationsContainer: {
        position: 'absolute',
        backgroundColor: '#fff',
        width: '400px',
        top: '20px',
        right: 0,
    },

    notificationsFooter: {
        padding: '8px 12px',
        textAlign: 'center'
    },


    notificationsFooterButton: {
        fontSize: '13px',
        fontWeight: 500,
        textDecoration: 'none',
        color: '#607d8b',
        
        //':hover': {
        //    textDecoration: 'underline'
        //}
    }
    
}

class NotificationPopup extends Component {
    //Using fat arrow to bind to instance
    handleDocumentClick = (e) => {
        const notificationsArea = document.getElementById("notifications");
        
        if (!notificationsArea.contains(e.target) && this.props.isOpened) {
            this.props.toggleNotificationsOpen();
        }
    }
    //Add event listeners after component mounts
    componentDidMount() {
        document.addEventListener('click', this.handleDocumentClick);
    }
    
    //Remove event listeners after component unmounts
    componentWillUnmount() {
        document.removeEventListener('click', this.handleDocumentClick);
    }

    render() {
        return (
            <Motion defaultStyle={{ opacity: 0, top: 40 }} style={{ opacity: spring(1), top: spring(50, { stiffness: 120, damping: 15 }) }}>
                {interpolatingStyle => 
                    <div style={[styles.wrapper, interpolatingStyle]}>
                        <div className="arrow" style={styles.arrow}></div>
                        <Paper className="notifications-container" style={styles.notificationsContainer}>
                            <div className="notification-header" style={styles.notificationsHeader}>
                                <p className="notifications-title" style={styles.notificationsTitle}>Notifications</p>
                                <button type="button" style={styles.notificationsHeaderButton} onClick={() => this.props.markAllRead(null)}>Mark all as read</button>
                            </div>
                            <Divider />
                            <NotificationList isPopup={true} />
                            <Divider />
                            <div className="notification-footer" style={styles.notificationsFooter}>
                                <RadiumLink to={"/notifications"} style={styles.notificationsFooterButton}>See All</RadiumLink>
                            </div>
                        </Paper>
                    </div>
                }
            </Motion>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        markAllRead: markReadInternal
    }, dispatch);
}

export default connect(null, mapDispatchToProps)(Radium(NotificationPopup));