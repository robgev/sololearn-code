import React, { PureComponent } from 'react';
import ReactGA from 'react-ga';
import { connect } from 'react-redux';
import { changeWeaponSetting, getWeaponSettings } from 'actions/settings';
import texts from 'texts';
import LanguageToggle from './LanguageToggle';

const mapStateToProps = ({ settings: { playSettings } }) => ({ playSettings });

const mapDispatchToProps = {
	changeWeaponSetting,
	getWeaponSettings,
};

@connect(mapStateToProps, mapDispatchToProps)
class Arsenal extends PureComponent {
	componentWillMount() {
		this.props.getWeaponSettings();
		ReactGA.ga('send', 'screenView', { screenName: 'Challenge Settings Page' });
	}

	render() {
		const { playSettings, changeWeaponSetting } = this.props;
		return (
			<div className="arsenal-settings-container">
				<p className="setting-banner">{texts.challengesBanner}</p>
				{playSettings.map(currentSetting => (
					<LanguageToggle
						{...currentSetting}
						key={currentSetting.id}
						onToggle={() => changeWeaponSetting({
							courseId: currentSetting.id,
							enable: !currentSetting.isPlayEnabled,
						})}
					/>
				))}
			</div>
		);
	}
}

export default Arsenal;
