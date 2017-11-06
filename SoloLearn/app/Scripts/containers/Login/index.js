import React, { PureComponent } from 'react';
import { browserHistory } from 'react-router';
import AlertContainer from 'react-alert';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { logout, login, signup, forgotPassword } from '../../actions/login.action';

import Login from './Login';

import Paper from 'material-ui/Paper';

class Index extends PureComponent {
    alertOptions = {
    	offset: 14,
    	position: 'top right',
    	theme: 'dark',
    	time: 2000,
    	transition: 'fade',
    }

    componentWillMount() {
    	if (this.props.loggedin != null) {
    		this.props.logout();
    	}
    }

    checkToFeed = (err) => {
    	if (!err) {
    		if (browserHistory.getCurrentLocation().pathname === '/login') {
    			return browserHistory.push('/feed');
    		}
    	}
    	return this.fault(err);
    }

    fault = err => err.map(curr => this.alert(curr.split(/(?=[A-Z])/).join(' '), 'info'))

    alert = (msg, type = 'error') => {
    	this.msg.show(msg, {
    		time: 2000, type,
    	});
    }

    login = (data) => {
    	this.props.login(data)
    		.then((err) => {
    			this.checkToFeed(err);
    		})
    		.catch(e => console.log(e));
    }

    signup = (data) => {
    	this.props.signup(data)
    		.then((err) => {
    			this.checkToFeed(err);
    		})
    		.catch(e => console.log(e));
    }

    forgot = (email) => {
    	this.props.forgotPassword(email)
    		.then((err) => {
    			// Will implement forgot password continuation later
    			err ? this.fault(err) : null;
    		})
    		.catch(e => console.log(e));
    }

    render() {
    	return (
    		<Paper
		zDepth={2}
    			style={{
    				width: '50%',
    				margin: 'auto',
    				padding: 10,
    			}}
	>
    			<AlertContainer ref={a => this.msg = a} {...this.alertOptions} />
    			<Login
    				alert={this.alert}
    				login={this.login}
    				signup={this.signup}
    				forgot={this.forgot}
	/>
	</Paper>
    	);
    }
}

const mapStateToProps = ({ loggedin }) => ({ loggedin });

const mapDispatchToProps = dispatch =>
	bindActionCreators({
		logout, login, signup, forgotPassword,
	}, dispatch);

export default connect(mapStateToProps, mapDispatchToProps)(Index);
