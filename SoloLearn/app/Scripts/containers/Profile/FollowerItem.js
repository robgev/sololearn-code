//React modules
import React, { Component } from 'react';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { followUserInternal, unfollowUserInternal } from '../../actions/profile';

//Material UI components
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';

//Utils
import getStyles from '../../utils/styleConverter';

const styles = {
    follower: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '10px'
    },

    details: {
        flex: 2,
        display: 'inline-flex',
        alignItems: 'center'
    },

    authorDetails: {
        margin: '0 0 0 8px'
    },

    name: {
        fontSize: '14px',
        color: '#424040'
    },

    info: {
        fontSize: '13px'
    },

    followButton: {
        base: {
            height: '25px'
        },

        label: {
            fontSize: '12px'
        },

        button: {
            height: '25px',
            lineHeight: '25px'
        },

        overlay: {
            height: '25px'
        }
    }
}

class FollowerItem extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFollowing: this.props.follower.isFollowing
        }

        this.handleFollowing = this.handleFollowing.bind(this);
    }

    handleFollowing(id, follow, fromFollowers) {
        this.setState({ isFollowing: follow });

        if (follow) {
            this.props.followUser(id, fromFollowers);
        }
        else {
            this.props.unfollowUser(id, fromFollowers);
        }
    }

    render() {
        const follower = this.props.follower;

        return (
            <div id="follower" style={styles.follower}>
                <div className="details" style={styles.details}>
                    <Avatar size={35} style={styles.avatar}>{follower.name.charAt(0)}</Avatar>
                    <div style={styles.authorDetails}>
                        <p style={styles.name}>{follower.name}</p>
                        <p style={styles.info}>{follower.followers} Followers | Level {follower.level}</p>
                    </div>
                </div>
                <RaisedButton
                    label={this.state.isFollowing ? "Following" : "Follow"}
                    primary={!this.state.isFollowing}
                    secondary={this.state.isFollowing}
                    style={styles.followButton.base}
                    labelStyle={styles.followButton.label}
                    buttonStyle={styles.followButton.button}
                    overlayStyle={styles.followButton.overlay}
                    onClick={() => { this.handleFollowing(follower.id, !this.state.isFollowing, this.props.fromFollowers) }}
                />
            </div>
        );
    }

    shouldComponentUpdate(nextProps, nextState) {
        return (this.props.follower !== nextProps.follower || this.state.isFollowing !== nextState.isFollowing);
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        followUser: followUserInternal,
        unfollowUser: unfollowUserInternal
    }, dispatch);
}

export default connect(() => { return {} }, mapDispatchToProps)(FollowerItem);