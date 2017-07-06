//React modules
import React, { Component } from 'react';

import contestTypes from '../defaults/contestTypes';
import getStyles from './styleConverter';

const styles = {
    base: {
        textAlign: 'center',
        fontWeight: 500,
        color: '#fff'
    },

    small: {
        width: '80px',
        padding: '3px',
        fontSize: '10px',
    },

    defaultColor: {
        backgroundColor: '#BDBDBD'
    },

    wonColor: {
        backgroundColor: '#9CCC65'
    },

    lostColor: {
        backgroundColor: '#D32F2F'
    },

    drawColor: {
        backgroundColor: '#607D8B'
    },

    yourTurnColor: {
        backgroundColor: '#37474F'
    }
}

const getChallengeStatus = (status) => {
    switch (status) {
        case contestTypes.Won:
            return <p style={getStyles(styles.base, styles.small, styles.wonColor)}> YOU WON</p>;
        case contestTypes.Lost:
            return <p style={getStyles(styles.base, styles.small, styles.lostColor)}>YOU LOST</p>;
        case contestTypes.Draw:
            return <p style={getStyles(styles.base, styles.small, styles.drawColor)}>DRAW</p>;
        case contestTypes.Expired:
            return <p style={getStyles(styles.base, styles.small, styles.defaultColor)}>EXPIRED</p>;
        case contestTypes.GotDeclined:
            return <p style={getStyles(styles.base, styles.small, styles.defaultColor)}>DECLINED</p>;
        case contestTypes.Started:
            return <p style={getStyles(styles.base, styles.small, styles.yourTurnColor)}>YOUR TURN</p>;
        case contestTypes.Challenged:
            return <p style={getStyles(styles.base, styles.small, styles.defaultColor)}>WAITING</p>;
        default:
            return "";
    }
}

export default getChallengeStatus;