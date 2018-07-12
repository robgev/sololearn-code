// React modules
import React, { Component } from 'react';

// Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFollowingInternal } from '../../../actions/profile';
import { isLoaded } from '../../../reducers';

// Additional components
import Opponents from './Opponents';

class Following extends Component {
	constructor(props) {
		super(props);

		this.getOpponents = this.getOpponents.bind(this);
	}

	getOpponents(index) {
		return this.props.getFollowing(index, this.props.userProfile.id, 20, true);
	}

	render() {
		const { isLoaded, opponents } = this.props;

		return (
			<div id="following">
				<Opponents getOpponents={this.getOpponents} opponents={opponents} isLoaded={isLoaded} ref="opponents" />
			</div>
		);
	}
}

function mapStateToProps(state) {
	return {
		isLoaded: isLoaded(state, 'challengesFollowing'),
		opponents: state.challenges.following,
		userProfile: state.userProfile,
	};
}

function mapDispatchToProps(dispatch) {
	return bindActionCreators({
		getFollowing: getFollowingInternal,
	}, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Following);
