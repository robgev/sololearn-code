//React modules
import React, { Component } from 'react';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { getFollowersInternal } from '../../actions/profile';
import { isLoaded } from '../../reducers';

//Additional data and components
import Follower from './FollowerItem';
import LoadingOverlay from '../../components/Shared/LoadingOverlay';

//Utils
import getStyles from '../../utils/styleConverter';

const styles = {
    container: {
        position: 'relative',
        height: '500px',
        overflowY: 'scroll'
    },

    bottomLoading: {
        base: {
            position: 'relative',
            width: '100%',
            height: '50px',
            visibility: 'hidden',
            opacity: 0,
            transition: 'opacity ease 300ms, -webkit-transform ease 300ms'
        },

        active: {
            visibility: 'visible',
            opacity: 1,
            transform: 'translateY(0)'
        },

        fullyLoaded: {
            display: 'none'
        }
    },

    noResults: {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%,-50%)',
        fontSize: '20px',
        color: '#777',
    }
}

class Followers extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isLoading: false,
            fullyLoaded: false
        }

        this.handleScroll = this.handleScroll.bind(this);
    }

    loadFollowers(index, userId) {
        this.setState({ isLoading: true });

        return this.props.getFollowers(index, userId).then(count => {
            if (count < 20) {
                this.setState({ fullyLoaded: true });
            }

            this.setState({ isLoading: false });
        }).catch((error) => {
            console.log(error);
        });
    }

    //Check scroll state
    handleScroll() {
        const scollingArea = document.getElementById("followers");
        if (scollingArea.scrollTop === (scollingArea.scrollHeight - scollingArea.offsetHeight) && !this.state.fullyLoaded) {
            if (!this.state.isLoading && !this.state.fullyLoaded) {
                this.loadFollowers(this.props.followers.length, this.props.userId);
            }
        }
    }

    renderFollowers() {
        return this.props.followers.map((follower, index) => {
            return (
                <Follower key={follower.id} follower={follower} fromFollowers={true} />
            );
        });
    }

    render() {
        const { isLoaded, followers } = this.props;

        return (
            <div id="followers" style={styles.container}>
                {(isLoaded && followers.length > 0) && this.renderFollowers()}
                {((!isLoaded || followers.length == 0) && !this.state.fullyLoaded) && <LoadingOverlay />}
                {
                    followers.length > 0 &&
                    <div className="loading" style={!this.state.isLoading ? (!this.state.fullyLoaded ? styles.bottomLoading.base : styles.bottomLoading.fullyLoaded) : getStyles(styles.bottomLoading.base, styles.bottomLoading.active)}>
                        <LoadingOverlay size={30} />
                    </div>
                }
                {(this.state.fullyLoaded && followers.length == 0) && <div style={styles.noResults}>No Results Found</div>}
            </div>
        );
    }

    componentWillMount() {
        if (!this.props.isLoaded) {
            this.loadFollowers(0, this.props.userId);
        }
    }

    //Add event listeners after component mounts
    componentDidMount() {
        const scollingArea = document.getElementById("followers");
        scollingArea.addEventListener('scroll', this.handleScroll);
    }

    //Remove event listeners after component unmounts
    componentWillUnmount() {
        const scollingArea = document.getElementById("followers");
        scollingArea.removeEventListener('scroll', this.handleScroll);
    }
}

function mapStateToProps(state) {
    return {
        isLoaded: isLoaded(state, "followers"),
        followers: state.profile.followers
    };
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        getFollowers: getFollowersInternal
    }, dispatch);
}

export default connect(mapStateToProps, mapDispatchToProps)(Followers);