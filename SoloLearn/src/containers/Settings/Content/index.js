import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import CircularProgress from 'material-ui/CircularProgress';
import texts from 'texts';
import BusyWrapper from 'components/BusyWrapper';
import { updateSetting, getSettings } from 'actions/settings';
import FeedSettingToggle from './FeedSettingToggle';

const mapStateToProps = ({ settings: { feedSettings } }) => ({ feedSettings });

const mapDispatchToProps = {
	updateSetting,
	getSettings,
};

@connect(mapStateToProps, mapDispatchToProps)
class Content extends PureComponent {
	constructor() {
		super();
		this.state = { loading: true };
	}

	async componentWillMount() {
		await this.props.getSettings();
		this.setState({ loading: false });
		ReactGA.ga('send', 'screenView', { screenName: 'Activity Feed Settings Page' });
	}

	render() {
		const { loading } = this.state;
		const { feedSettings, updateSetting } = this.props;
		return (
			<BusyWrapper
				isBusy={loading}
				style={{ minHeight: '60vh' }}
				wrapperClassName="content-settings-container"
				loadingComponent={
					<CircularProgress
						size={100}
					/>
				}
			>
				<p className="setting-banner content-setting-banner">{texts.customizeFeed}</p>
				{feedSettings && Object.keys(feedSettings).map(currentSettingKey => (
					<FeedSettingToggle
						key={currentSettingKey}
						name={currentSettingKey}
						isSettingOn={feedSettings[currentSettingKey]}
						onToggle={() => updateSetting({
							[currentSettingKey]: !feedSettings[currentSettingKey],
						})}
					/>
				))}
			</BusyWrapper>
		);
	}
}

export default Content;
