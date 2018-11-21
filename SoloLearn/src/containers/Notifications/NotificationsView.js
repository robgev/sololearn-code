import React, {Component} from 'react';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';
import { getDiscoverSuggestions } from 'actions/discover';
import FeedSidebar from 'containers/Feed/FeedSidebar';
import NotificationList from './NotificationList';
import { LayoutWithSidebar } from 'components/molecules';
import {
	PaperContainer,
	Title,
	HorizontalDivider,
} from 'components/atoms';

const mapDispatchToProps = { getDiscoverSuggestions };

@connect(null, mapDispatchToProps)
@translate()
class Notifications extends Component {
	constructor() {
		super();
	}

	componentDidMount = () => {
		this.props.getDiscoverSuggestions()
				.catch(e => showError(e, 'Something went wrong when trying to fetch user suggestions'));
	}

	render() {
		const { t } = this.props;
		return (
			<LayoutWithSidebar
				sidebar={<FeedSidebar t={t} />}
			>
				<PaperContainer>
					<Title>{t('notifications.title')}</Title>
					<HorizontalDivider />
					<NotificationList isPopup={false} />
				</PaperContainer>
			</LayoutWithSidebar>
		);
	}
}

export default Notifications;
