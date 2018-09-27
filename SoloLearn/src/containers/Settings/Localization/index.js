import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

import { resetLocaleData } from 'actions/settings';

import LanguageSelector from './LanguageSelector';

const mapStateToProps = state => ({ locale: state.locale });

@connect(mapStateToProps, { resetLocaleData })
@translate()
class Profile extends PureComponent {
	handleLocaleChange = (_, __, locale) => {
		this.props.resetLocaleData(locale);
	}

	render() {
		const { t, locale } = this.props;
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
