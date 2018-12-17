import React from 'react';
import { connect } from 'react-redux';
import { withRouter } from 'react-router';
import NotificationManager from './NotificationManager';

const mapStateToProps = state => ({
	userID: state.userProfile ? state.userProfile.id : null,
	locale: state.locale,
});

// Need to remount NotificaitonManager when locale or user changes
const Notifications = ({ userID, locale, location }) => <NotificationManager key={`${userID}-${locale}-${location.pathname}`} />;

export default connect(mapStateToProps)(withRouter(Notifications));
