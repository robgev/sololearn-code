import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import i18n from 'i18next';

import { resetLocaleData } from 'actions/settings';
import Service from 'api/service';
import Storage from 'api/storage';

import LanguageSelector from './LanguageSelector';

@connect(null, { resetLocaleData })
@translate()
class Profile extends PureComponent {
	constructor(props) {
		super(props);
		const locale = Storage.load('locale') || 'en';
		this.state = {
			locale,
		};
	}

	handleLocaleChange = (_, __, locale) => {
		this.setState({ locale });
		Storage.save('locale', locale);
		Service.getSession(locale);
		i18n.changeLanguage(locale, (err) => {
			if (err) { console.log('something went wrong loading', err); }
		});
		this.props.resetLocaleData();
	}

	render() {
		const { locale } = this.state;
		const { t } = this.props;
		return (
			<div className="profile-settings-container">
				<LanguageSelector
					t={t}
					value={locale}
					onChange={this.handleLocaleChange}
				/>
			</div>
		);
	}
}

export default Profile;
