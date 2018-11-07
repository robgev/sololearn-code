import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import texts from 'texts';
import { updateSetting, getSettings } from 'actions/settings';
import FeedSettingToggle from './FeedSettingToggle';

import {
	getFeedItemsInternal,
	getPinnedFeedItemsInternal,
	clearFeedItems,
} from 'actions/feed';

import {
	Loading,
	Container,
	TextBlock,
	HorizontalDivider
} from 'components/atoms';

const mapStateToProps = ({ settings: { feedSettings } }) => ({ feedSettings });

const mapDispatchToProps = {
	updateSetting,
	getSettings,
	getFeedItems: getFeedItemsInternal,
	getPinnedFeedItems: getPinnedFeedItemsInternal,
	clearFeedItems,
};

@connect(mapStateToProps, mapDispatchToProps)
class Content extends PureComponent {
	constructor() {
		super();
		this.state = { loading: true };
	}

	async componentDidMount() {
		await this.props.getSettings();
		this.setState({ loading: false });
		ReactGA.ga('send', 'screenView', { screenName: 'Activity Feed Settings Page' });
	}

	onToggle = (event) => {
		const { feedSettings, updateSetting, getFeedItems, getPinnedFeedItems, clearFeedItems } = this.props;
		const currentSettingKey = event.target.name;
		updateSetting({[currentSettingKey]: !feedSettings[currentSettingKey]});
		clearFeedItems();
		getFeedItems();
		getPinnedFeedItems();
	} 

	render() {
		const { loading } = this.state;
		const { feedSettings, updateSetting } = this.props;
		return loading? (<Loading className="settings_loading"/>) : (
			<Container
				className="content-settings-container"
			>
				<Container className="content-setting-banner">
					<TextBlock>{texts.customizeFeed}</TextBlock>
					<HorizontalDivider/>
				</Container>
				{feedSettings && Object.keys(feedSettings).map(currentSettingKey => (
					<FeedSettingToggle
						key={currentSettingKey}
						name={currentSettingKey}
						isSettingOn={feedSettings[currentSettingKey]}
						onToggle={this.onToggle}
						
					/>
				))}
			</Container>
		);
	}
}

export default Content;
