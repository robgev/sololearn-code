import React from 'react';
import { connect } from 'react-redux';
import NotificationManager from './NotificationManager';

const mapStateToProps = state => ({
	userID: state.userProfile ? state.userProfile.id : null,
	locale: state.locale,
});

// Need to remount NotificaitonManager when locale or user changes
const Notifications = ({ userID, locale }) => <NotificationManager key={userID + locale} />;

export default connect(mapStateToProps)(Notifications);
