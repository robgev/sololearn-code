import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { getUserProfileSync, getUserProfileAsync } from 'actions/profile';
import { omit } from 'lodash';

export default (Comp) => {
	class Redirector extends Component {
		componentWillMount() {
			if (!this.props.getUserProfileSync()) {
				browserHistory.replace('/login');
			}
		}
		render() {
			const cleanedProps = omit(this.props, [ 'getUserProfileAsync', 'getUserProfileSync' ]);
			return <Comp {...cleanedProps} />;
		}
	}
	return connect(null, { getUserProfileAsync, getUserProfileSync })(Redirector);
};
