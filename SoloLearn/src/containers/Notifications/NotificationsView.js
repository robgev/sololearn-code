import React, { Component } from 'react';
import { connect } from 'react-redux';
import { getDiscoverSuggestions } from 'actions/discover';
import FeedSidebar from 'containers/Feed/FeedSidebar';
import { showError } from 'utils';
import {
	PaperContainer,
	HorizontalDivider,
} from 'components/atoms';
import { LayoutWithSidebar } from 'components/molecules';
import { Header } from './components';
import NotificationList from './NotificationList';

const mapDispatchToProps = { getDiscoverSuggestions };

@connect(null, mapDispatchToProps)
class Notifications extends Component {
	componentDidMount = () => {
		this.props.getDiscoverSuggestions()
			.catch(e => showError(e, 'Something went wrong when trying to fetch user suggestions'));
	}

	render() {
		return (
			<LayoutWithSidebar
				paper={false}
				sidebar={<FeedSidebar />}
			>
				<PaperContainer>
					<Header />
					<HorizontalDivider />
					<NotificationList isPopup={false} />
				</PaperContainer>
			</LayoutWithSidebar>
		);
	}
}

export default Notifications;
