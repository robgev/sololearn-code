//React modules
import React, { Component } from 'react';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFollowersInternal } from '../../../actions/profile';
import { isLoaded } from '../../../reducers';

//Additional components
import Opponents from './Opponents';

class Followers extends Component {
    constructor(props) {
        super(props);

        this.getOpponents = this.getOpponents.bind(this);
    }

    getOpponents(index) {
        return this.props.getFollowers(index, this.props.userProfile.id, 20, true);
    }

    render() {
        const { isLoaded, opponents } = this.props;

        return (
            <div id="followers">
                <Opponents getOpponents={this.getOpponents} opponents={opponents} isLoaded={isLoaded} ref="opponents" />
            </div>
        );
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "challengesFollowers"),
        opponents: state.challenges.followers,
        userProfile: state.userProfile
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getFollowers: getFollowersInternal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);