// React modules
import React from 'react';

import contestTypes from 'defaults/contestTypes';

const styles = {
	base: {
		width: '80px',
		padding: '3px',
		color: '#FFFFFF',
		textAlign: 'center',
		fontSize: '10px',
		fontWeight: 500,
	},
	defaultColor: {
		backgroundColor: '#BDBDBD',
	},

	wonColor: {
		backgroundColor: '#9CCC65',
	},

	lostColor: {
		backgroundColor: '#D32F2F',
	},

	drawColor: {
		backgroundColor: '#607D8B',
	},

	yourTurnColor: {
		backgroundColor: '#37474F',
	},
};

const getChallengeStatus = (status, style = {}) => {
	switch (status) {
	case contestTypes.Won:
		return <p style={{ ...styles.base, ...styles.wonColor, ...style }}>YOU WON</p>;
	case contestTypes.Lost:
		return <p style={{ ...styles.base, ...styles.lostColor, ...style }}>YOU LOST</p>;
	case contestTypes.Draw:
		return <p style={{ ...styles.base, ...styles.drawColor, ...style }}>DRAW</p>;
	case contestTypes.Expired:
		return <p style={{ ...styles.base, ...styles.defaultColor, ...style }}>EXPIRED</p>;
	case contestTypes.GotDeclined:
		return <p style={{ ...styles.base, ...styles.defaultColor, ...style }}>DECLINED</p>;
	case contestTypes.Started:
		return <p style={{ ...styles.base, ...styles.yourTurnColor, ...style }}>YOUR TURN</p>;
	case contestTypes.Challenged:
		return <p style={{ ...styles.base, ...styles.defaultColor, ...style }}>WAITING</p>;
	default:
		return <p />;
	}
};

export default getChallengeStatus;
