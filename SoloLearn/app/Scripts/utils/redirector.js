import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { omit } from 'lodash';

const mapStateToProps = ({ imitLoggedin }) => ({ imitLoggedin });

export default (Comp) => {
	class Redirector extends Component {
		componentWillMount() {
			if (!this.props.imitLoggedin) browserHistory.replace('/login');
		}
		render() {
			const cleanedProps = omit(this.props, 'imitLoggedin');
			return <Comp {...cleanedProps} />;
		}
	}
	return connect(mapStateToProps)(Redirector);
};
