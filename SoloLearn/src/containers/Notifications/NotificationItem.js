import React, { Component } from 'react';
import { connect } from 'react-redux';
import { markRead } from 'actions/notifications';
import NotificationToaster from './NotificationToaster';
import { ListItem } from 'components/atoms';

import './NotificationItem.scss';

const mapDispatchToProps = { markRead };

@connect(null, mapDispatchToProps)
class NotificationItem extends Component {
	onClick = () => {
		this.props.markRead([ this.props.notification.id ]);
		this.props.handleOpenIfPopup();
	}
	render() {
		const { notification } = this.props;
		const generatedContent = NotificationToaster.generateContent(notification, this.onClick);
		return (
			<ListItem
				className="notification-item"
			>
				{generatedContent}
			</ListItem>
		);
	}
}

export default NotificationItem;
