// General modules
import React, { Component } from 'react';
import { connect } from 'react-redux';

// Material UI components
import { ListItem } from 'material-ui/List';

// Redux modules
import { markRead } from 'actions/notifications';

// Utils And Defaults
import NotificationToaster from './NotificationToaster';

import { NotificationItemStyles as styles } from './styles';

const mapDispatchToProps = { markRead };

@connect(null, mapDispatchToProps)
class NotificationItem extends Component {
	toggleToast = () => NotificationToaster.toast(
		this.props.notification,
		this.props.markRead,
		this.props.handleOpenIfPopup,
	);

	render() {
		const generatedContent = NotificationToaster.generateContent(this.props.notification);
		return (
			<ListItem
				containerElement="div"
				onClick={this.toggleToast}
				className="notification-item"
				style={styles.notificationItem}
				innerDivStyle={styles.notificationItemInner}
			>
				{generatedContent}
			</ListItem>
		);
	}
}

export default NotificationItem;
