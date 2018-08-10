import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { getUserSelector } from 'reducers/reducer_user';

const mapStateToProps = state => ({
	isUserLoaded: getUserSelector(state) !== null,
});

export default (Comp) => {
	@connect(mapStateToProps)
	class Redirector extends Component {
		componentWillMount() {
			if (!this.props.isUserLoaded) {
				browserHistory.replace('/login');
			}
		}
		render() {
			const { isUserLoaded, ...childProps } = this.props;
			return <Comp {...childProps} />;
		}
	}
	return Redirector;
};
