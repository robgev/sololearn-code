import React, { Component } from 'react';
import { browserHistory, withRouter } from 'react-router';
import { connect } from 'react-redux';
import { getUserSelector } from 'reducers/reducer_user';

const mapStateToProps = state => ({
	isUserLoaded: getUserSelector(state) !== null,
});

export default (Comp) => {
	@withRouter
	@connect(mapStateToProps)
	class Redirector extends Component {
		componentWillMount() {
			if (!this.props.isUserLoaded) {
				const { location } = this.props;
				const nextLocation = `${location.pathname}${location.search}`;
				browserHistory.replace(`/login?url=${nextLocation}`);
			}
		}
		render() {
			const { isUserLoaded, ...childProps } = this.props;
			return <Comp {...childProps} />;
		}
	}
	return Redirector;
};
