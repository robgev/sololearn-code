import React, { PureComponent } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { resetLocaleData } from 'actions/settings';
import LanguageSelector from './LanguageSelector';
import { Container } from 'components/atoms';

const mapStateToProps = state => ({ locale: state.locale });

@connect(mapStateToProps, { resetLocaleData })
@translate()
class Profile extends PureComponent {
	handleLocaleChange = (event) => {
		const locale = event.target.value; 
		if (this.props.locale !== locale) {
			this.props.resetLocaleData(locale);
		}
	}

	render() {
		const { t, locale } = this.props;
		return (
			<Container className="profile-settings-container">
				<LanguageSelector
					t={t}
					value={locale}
					onChange={this.handleLocaleChange}
				/>
			</Container>
		);
	}
}

export default Profile;
