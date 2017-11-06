import React, { PureComponent } from 'react';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, imitateLogin } from '../../actions/login.action';

import { browserHistory } from 'react-router';

class SettingsMenu extends PureComponent {
    singOut = () => {
    	this.props.logout()
    		.then(() => browserHistory.push('/login'));
    }
    render() {
    	return (
    		<IconMenu
		style={{ width: 40, height: 40, padding: 10 }}
		iconButtonElement={<IconButton><MoreVertIcon color="#fff" /></IconButton>}
    			anchorOrigin={{ horizontal: 'left', vertical: 'top' }}
		targetOrigin={{ horizontal: 'left', vertical: 'top' }}
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

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		logout,
		imitateLogin,
	}, dispatch);
}

export default connect(() => ({}), mapDispatchToProps)(SettingsMenu);
