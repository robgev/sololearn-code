import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';

const mapStateToProps = ({ imitLoggedin }) => ({ imitLoggedin });

export default (Comp) => {
	class Redirector extends Component {
		constructor(props) {
			super(props);
			const { imitLoggedin, ...other } = this.props;
			this._props = other;
		}
		componentWillMount() {
			if (!this.props.imitLoggedin) browserHistory.replace('/login');
		}
		render() {
			return <Comp {...this._props} />;
		}
	}
	return connect(mapStateToProps)(Redirector);
};
