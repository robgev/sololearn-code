//React modules
import React, { PureComponent } from 'react';
import { Link, browserHistory } from 'react-router';

//Material UI components
import Avatar from 'material-ui/Avatar';
import Paper from 'material-ui/Paper';
import LinearProgress from 'material-ui/LinearProgress';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    container: {
        cursor: 'pointer',
        padding: '10px'
    },

    detailsWrapper: {
        display: 'flex',
        alignItems: 'center'
    },

    details: {
        flex: '2 auto',
        margin: '0 0 0 8px'
    },

    name: {
        fontSize: '14px',
        fontWeight: 500,
        color: '#5d5b5b'
    },

    leaderboardLink: {
        fontSize: '12px',
        fontWeight: 500,
        textDecoration: 'none',
        color: '#607d8b',
        margin: '5px 0',
        display: 'block'
    },

    progressWrapper: {
        textAlign: 'right'
    },

    status: {
        fontSize: '11px',
        color: '#777'
    },

    progress: {
        backgroundColor: '#dedede'
    },

    actions: {
        margin: '10px 0 0 0',
        textAlign: 'right'
    }
}

class Header extends PureComponent {
    navigateToProfile = () => {
        const profile = this.props.userProfile;
        browserHistory.push('/profile/' + profile.id);
    }
    render() {
        const { levels, profile } = this.props;
        const { level: userLevel, xp: currentXp } = profile;
        let maxXp = null;
        let status = "";
        const levelsWithStatus = levels.filter(item => item.status != null);
        //TODO Write a comment
        if (userLevel >= levelsWithStatus[levelsWithStatus.length - 1].number) {
            maxXp = currentXp;
            status = levelsWithStatus[levelsWithStatus.length - 1].status;
        } else {
            for (let i = userLevel; i < levels.length - 1; i++) {
                let currentLevel = levels[i];

                if (currentLevel.status != null) {
                    maxXp = levels[i - 1].maxXp;
                    status = currentLevel.status;
                    break;
                }
            }
        }
        return (
            <Paper className="feed-header" style={styles.container} onClick={this.navigateToProfile}>
                <div className="details-wrapper" style={styles.detailsWrapper}>
                    <Avatar size={50} style={styles.avatar}>{profile.name.charAt(0).toUpperCase()}</Avatar>
                    <div className="details" style={styles.details}>
                        <p style={styles.name}>{profile.name}</p>
                        <Link to={'/leaderboard'} style={styles.leaderboardLink}>Check out the leaderboard</Link>
                        <div style={styles.progressWrapper}>
                            <LinearProgress style={styles.progress}
                                mode="determinate" min={0}
                                max={maxXp}
                                value={currentXp} color="#8BC34A" />
                            <span style={styles.status}>{status}</span>
                        </div>
                    </div>
                </div>
                <div className="actions" style={styles.actions}>
                    <RaisedButton label="Invite Friends" secondary={true} />
                </div>
            </Paper>
        );
    }
}

export default Header;