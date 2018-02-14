import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { logout, imitateLogin } from 'actions/login.action';

const mapDispatchToProps = {
	logout,
	imitateLogin,
};

@connect(null, mapDispatchToProps)
class SettingsMenu extends PureComponent {
	singOut = () => {
		this.props.logout()
			.then(() => browserHistory.push('/login'));
	}
	render() {
		return (
			<IconMenu
				anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
				targetOrigin={{ horizontal: 'left', vertical: 'top' }}
				iconButtonElement={<IconButton><MoreVertIcon color="#fff" /></IconButton>}
			>
				<MenuItem
					primaryText="Sign out"
					onClick={this.singOut}
				/>
				<MenuItem
					primaryText="Imitate logout"
					onClick={this.props.imitateLogin}
				/>
			</IconMenu>
		);
	}
}

export default SettingsMenu;
