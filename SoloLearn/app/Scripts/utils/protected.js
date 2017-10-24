import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { changeLoginModal } from '../actions/login.action';
import LoadingOverlay from '../components/Shared/LoadingOverlay';
import { isLoaded, defaultsLoaded } from '../reducers';

const mapStateToProps = (state) => {
    return {
        loggedin: state.imitLoggedin,
        defaultsLoaded: defaultsLoaded(state),
        initiallyLoaded: isLoaded(state, 'initallyLoaded')
    }
}
const mapDispatchToProps = (dispatch) => {
    return bindActionCreators({ changeLoginModal }, dispatch);
}
export default (Comp) => {
    class Authenticate extends Component {
        state = { isEventListenerOn: false }
        componentWillMount() {
            this.turnEventListener(!this.props.loggedin);
        }
        componentWillReceiveProps(nextProps) {
            this.turnEventListener(!nextProps.loggedin);
        }
        turnEventListener = shoudBeOn => {
            if(shoudBeOn && !this.state.isEventListenerOn) {
                console.log('SCROLL LISTENER IS ON')
                addEventListener('scroll', this.scrollPrivacy);
                this.setState({ isEventListenerOn: true });
            } else if (!shoudBeOn && this.state.isEventListenerOn) {
                console.log('SCROLL LISTENER IS OFF')
                removeEventListener('scroll', this.scrollPrivacy);
            }
        }
        scrollPrivacy = (e) => {
            if(window.scrollY > 2000) {
                this.props.changeLoginModal(true);
                window.scrollTo(0, 1999);
            }
        }

        render() {
            return <Comp { ...this.props } />;
        }
    }
    return connect(mapStateToProps, mapDispatchToProps)(Authenticate);
}