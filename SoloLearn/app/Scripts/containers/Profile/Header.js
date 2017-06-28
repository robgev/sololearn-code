//React modules
import React, { Component } from 'react';

//Redux modules
import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { followUserInternal, unfollowUserInternal } from '../../actions/profile';

//Material UI components
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';
import Person from 'material-ui/svg-icons/social/person';

//Utils and defaults
import getStyles from '../../utils/styleConverter';
import numberFormatter from '../../utils/numberFormatter';

const styles = {
    detailsWrapper: {
        position: 'relative'
    },

    details: {
        width: '50%',
        margin: '0 auto 10px',
        textAlign: 'center'
    },

    userNameWrapper: {
        position: 'relative'
    },

    userName: {
        fontSize: '17px',
        fontWeight: 500,
        margin: '7px 0 3px 0'
    },

    level: {
        fontSize: '13px',
        margin: '0 0 3px 0'
    },

    userStats: {
        position: 'relative'
    },

    xp: {
        base: {
            position: 'absolute',
            top: 0,
            fontSize: '10px',
            fontWeight: 500,
            color: '#fff'
        },

        left: {
            left: '2px'
        },

        right: {
            right: '2px'
        }
    },

    progress: {
        height: '13px',
        backgroundColor: '#dedede'
    },

    followersButton: {
        base: {
            position: 'absolute',
            minWidth: '50px',
            margin: '0 0 0 5px'
        },

        button: {
            height: '30px',
            lineHeight: '30px'
        },

        overlay: {
            height: '30px'
        }
    },

    followersIcon: {
        height: '20px',
        width: '20px',
        margin: '0 0 0 10px'
    },

    actionButton: {
        base: {
            position: 'absolute',
            right: '10px',
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

class Header extends Component {
    constructor(props) {
        super(props);

        this.state = {
            isFollowing: this.props.profile.isFollowing
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
        const { profile, levels } = this.props;

        const nextLevel = levels.filter(item => { return item.maxXp > profile.xp; })[0];

        return (
            <div className="details-wrapper" style={styles.detailsWrapper}>
                {
                    profile.id !== 24379 &&
                    <RaisedButton
                        label={this.state.isFollowing ? "Following" : "Follow"}
                        primary={!this.state.isFollowing}
                        secondary={this.state.isFollowing}
                        style={styles.actionButton.base}
                        labelStyle={styles.actionButton.label}
                        buttonStyle={styles.actionButton.button}
                        overlayStyle={styles.actionButton.overlay}
                        onClick={() => { this.handleFollowing(profile.id, !this.state.isFollowing, null) }}
                    />
                }
                <div className="details" style={styles.details}>
                    <Avatar size={70} style={styles.avatar}>R</Avatar>
                    <div style={styles.userNameWrapper}>
                        <span style={styles.userName}>{profile.name}</span>
                        <RaisedButton
                            label={numberFormatter(profile.followers)}
                            secondary={true}
                            icon={<Person style={styles.followersIcon} />}
                            style={styles.followersButton.base}
                            buttonStyle={styles.followersButton.button}
                            overlayStyle={styles.followersButton.overlay}
                            onClick={this.props.openPopup}
                        />
                    </div>
                    <p style={styles.level}>LEVEL {profile.level}</p>
                    <div className="progress-wrapper" style={styles.userStats}>
                        <LinearProgress style={styles.progress}
                            mode="determinate" min={0}
                            max={nextLevel.maxXp}
                            value={profile.xp} color="#8BC34A" />
                        <span style={getStyles(styles.xp.base, styles.xp.left)}>{profile.xp} XP</span>
                        <span style={getStyles(styles.xp.base, styles.xp.right)}>{nextLevel.maxXp} XP</span>
                    </div>
                </div>
            </div>
        );
    }
}

function mapDispatchToProps(dispatch) {
    return bindActionCreators({
        followUser: followUserInternal,
        unfollowUser: unfollowUserInternal
    }, dispatch);
}

export default connect(() => { return {} }, mapDispatchToProps)(Header);