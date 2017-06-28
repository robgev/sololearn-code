//React modules
import React, { Component } from 'react';

//Additional data and components
import User from './User';

const styles = {
    challenge: {
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center'
    },

    score: {
        fontSize: '25px',
        fontWeight: 500,
        color: '#545454',
    }
}

class Challenge extends Component {
    constructor(props) {
        super(props);
    }

    render() {
        const contest = this.props.contest;
        const courseId = contest.courseID;
        const player = contest.player;
        const opponent = contest.opponent;

        return (
            <div className="challenge" style={styles.challenge}>
                <User user={player} openPopup={this.props.openPopup} courseId={courseId} />
                <div className="score" style={styles.score}>
                    <span>{player.score}</span>
                    <span> : </span>
                    <span>{opponent.score}</span>
                </div>
                <User user={opponent} openPopup={this.props.openPopup} courseId={courseId} />
            </div>
        );
    }
}

export default Challenge;