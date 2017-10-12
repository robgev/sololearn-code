//React modules
import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import moment from 'moment';

//Material UI components
import Avatar from 'material-ui/Avatar';
import { ListItem } from 'material-ui/List';
import { blueGrey600 } from 'material-ui/styles/colors';

//App defaults and utils
import contestTypes from '../../../defaults/contestTypes';
import getSyles from '../../../utils/styleConverter';
import updateDate from '../../../utils/dateFormatter';
import getChallengeStatus from '../../../utils/getChallengeStatus';

const styles = {
    content: {
        display: 'flex',
        alignItems: 'center',
        padding: '10px',
        //borderBottom: '1px solid #e0e0e0'
    },

    wrapper: {
        margin: '0 0 0 8px',
        flexGrow: 1,
    },

    userName: {
        fontSize: '13px',
        color: '#545454'
    },

    statusesWrapper: {
        display: 'flex',
        alignItems: 'center'
    },

    languageName: {
        fontSize: '10px',
        fontWeight: 500,
        padding: '3px 5px',
        margin: '0 5px 0 0',
        color: '#fff',
        backgroundColor: '#607D8B'
    },

    resultsWrapper: {
        width: '50px',
        textAlign: 'center',
        margin: '0 0 0 15px'
    },

    score: {
        fontSize: '15px',
        fontWeight: 500,
        color: '#545454'
    },

    rewardXp: {
        fontSize: '14px',
        color: '#9CCC65'
    },

    date: {
        fontSize: '11px'
    }
}

class ContestItemBase extends Component {
    getDateDifference(expireDate) {
        const relativeDate = "Expires in ";

        const dateNow = moment(new Date());
        const duration = moment.duration(moment(expireDate).diff(moment(dateNow)));
        const hours = Math.floor(duration.asHours());
    
        if (hours < 1) {
            return relativeDate + duration.asMinutes() + " min";   
        }

        return relativeDate + hours + " hr";
    }

    getContest(contestId) {
        browserHistory.push('/challenge/' + contestId);
    }

    render() {
        const { courseName, contest } = this.props;
        const status = contest.player.status;
        const isCompleted = status !== contestTypes.Started && status !== contestTypes.Challenged && status !== contestTypes.GotChallenged;

        return (
            <ListItem className="content" containerElement="div" innerDivStyle={styles.content} onClick={() => this.getContest(contest.id)}>
                <Avatar size={30}>{contest.opponent.name.charAt(0).toUpperCase()}</Avatar>
                <div className="wrapper" style={styles.wrapper}>
                    <p style={styles.userName}>{contest.opponent.name}</p>
                    <p style={styles.date}>{isCompleted ? updateDate(contest.date) : this.getDateDifference(contest.expireDate)}</p>
                </div>
                <div style={styles.statusesWrapper}>
                    <p style={styles.languageName}>{courseName.toUpperCase()}</p>
                    {status !== contestTypes.GotChallenged && getChallengeStatus(status)}
                </div>
                <div style={styles.resultsWrapper}>
                {
                    isCompleted ?
                    <p className="score" style={styles.score}>
                        <span>{contest.player.score}</span>
                        <span> : </span>
                        <span>{contest.opponent.score}</span>
                    </p>
                    :
                    <p style={styles.rewardXp}>{contest.player.rewardXp} XP</p>
                 }
                </div>
            </ListItem>
        );
    }
}

export default ContestItemBase;