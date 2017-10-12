//React modules
import React, { Component } from 'react';

//Material UI components
import Avatar from 'material-ui/Avatar';
import RaisedButton from 'material-ui/RaisedButton';

const styles = {
    container: {
        padding: '15px 0 0 0',
        textAlign: 'center'
    },

    userWrapper: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    user: {
        textAlign: 'center',
        width: '40%'
    },

    avatar: {
        margin: '0 0 8px 0'
    },

    userName: {
        fontWeight: 500,
        color: '#616161',
        margin: '0 0 5px 0'
    },

    level: {
        fontSize: '14px'  
    },

    versusStyle: {
        fontSize: '27px',  
        fontWeight: 500,
        color: '#455A64'
    },

    languageName: {
        display: 'inline-block',
        width: '120px',
        fontSize: '14px',
        fontWeight: 500,
        padding: '5px',
        color: '#fff',
        backgroundColor: '#607D8B',
        textAlign: 'center'
    },

    result: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        flexDirection: 'column',
        margin: '20px 0 0 0'
    },

    resultTitle: {
        color: '#7CB342',
        fontWeight: 500,
        margin: '0 0 5px 0'
    },

    rewardXp: {
        width: '95px',
        padding: '3px',
        border: '2px solid #7CB342',
        color: '#7CB342',
        fontWeight: 500
    },

    button: {
        margin: '50px 10px 0 10px'
    }
}

class Start extends Component {
    render() {
        const { courseName, contest } = this.props;

        return (
            <div id="challenge-start" style={styles.container}>
                <div style={styles.userWrapper}>
                    <div style={styles.user}>
                        <Avatar size={100} style={styles.avatar}>{contest.player.name.charAt(0).toUpperCase()}</Avatar>
                        <p style={styles.userName}>{contest.player.name}</p>
                        <p style={styles.level}>LEVEL {contest.player.level}</p>
                    </div>
                    <span style={styles.versusStyle}>VS</span>
                    <div style={styles.user}>
                        <Avatar size={100} style={styles.avatar}>{contest.opponent.name.charAt(0).toUpperCase()}</Avatar>
                        <p style={styles.userName}>{contest.opponent.name}</p>
                        <p style={styles.level}>LEVEL {contest.opponent.level}</p>
                    </div>
                </div>
                <p style={styles.languageName}>{courseName.toUpperCase()}</p>
                <div style={styles.result}>
                    <p style={styles.resultTitle}>WINNER GETS</p>
                    <p style={styles.rewardXp}>{contest.player.rewardXp} XP</p>
                    <div>
                        <RaisedButton
                            label='Start'
                            style={styles.button}
                            secondary
                            onClick={this.props.next}
                        />
                        <RaisedButton
                            label='Decline'
                            style={styles.button}
                            primary
                            onClick={this.props.decline}
                        />
                    </div>
                </div>
            </div>
        );
    }
}

export default Start;