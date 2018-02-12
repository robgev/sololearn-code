export const NotificationItemStyles = {
	notificationItem: {
	},
	notificationItemInner: {
		padding: '10px',
	},
	notificationContent: {
		display: 'flex',
	},
	additionalDetails: {
		width: '90%',
		margin: '0 0 0 5px',
		color: '#777',
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
			justifyContent: 'center',
		},
		icon: {
			height: '15px',
			width: '15px',
		},
	},
	date: {
		fontSize: '11px',
	},
	title: {
		fontSize: '13px',
		zIndex: 1000000,
	},
	userName: {
		textDecoration: 'none',
	},
	notClickedIcon: {
		width: '6px',
		height: '6px',
		backgroundColor: '#607d8b',
		verticalAlign: 'middle',
		display: 'inline-block',
		borderRadius: '50%',
		margin: '0 0 0 5px',
	},
};

export const NotificationListStyles = {
	notificationsContainer: {
		position: 'absolute',
		backgroundColor: '#fff',
		width: '400px',
		top: '20px',
		right: 0,
	},
	notificationsTitle: {
		padding: '11px 14px',
		fontSize: '13px',
		fontWeight: 500,
	},
	notificationsBody: {
		base: {
			position: 'relative',
			padding: 0,
			minHeight: '50px',
		},
		fixedHeight: {
			height: '400px',
			overflowY: 'scroll',
		},
	},
	bottomLoading: {
		base: {
			position: 'relative',
			width: '100%',
			visibility: 'hidden',
			opacity: 0,
			transition: 'opacity ease 300ms, -webkit-transform ease 300ms',
		},
		small: {
			height: '30px',
		},
		big: {
			height: '50px',
		},
		active: {
			visibility: 'visible',
			opacity: 1,
			transform: 'translateY(0)',
		},
	},
	notificationsFooter: {
		padding: '8px 12px',
		textAlign: 'center',
	},
	notificationsFooterButton: {
		fontSize: '13px',
		fontWeight: 500,
		textDecoration: 'none',
		color: '#607d8b',
		':hover': {
			textDecoration: 'underline',
		},
	},
};

export const NotificationsPopupStyles = {
	wrapper: {
		position: 'absolute',
		right: '15px',
		opacity: 0,
		zIndex: 10001,
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
		zIndex: 10001,
	},
	notificationsHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '11px 14px',
	},
	notificationsHeaderButton: {
		border: 'none',
		backgroundColor: '#fff',
		outline: 'none',
		color: '#607d8b',
		cursor: 'pointer',
		// ':hover': {
		//    textDecoration: 'underline'
		// }
	},

	notificationsTitle: {
		fontSize: '13px',
		fontWeight: 500,
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
		textAlign: 'center',
	},
	notificationsFooterButton: {
		fontSize: '13px',
		fontWeight: 500,
		textDecoration: 'none',
		color: '#607d8b',
		// ':hover': {
		//    textDecoration: 'underline'
		// }
	},
};

export const NotificationsViewStyles = {
	notificationsHeader: {
		display: 'flex',
		justifyContent: 'space-between',
		alignItems: 'center',
		padding: '11px 14px',
	},
	notificationsTitle: {
		fontSize: '13px',
		fontWeight: 500,
	},
};
