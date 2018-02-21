// React modules
import React from 'react';

import contestTypes from 'defaults/contestTypes';

// i18n
import i18n from 'i18n';

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
		return <p style={{ ...styles.base, ...styles.wonColor, ...style }}>{i18n.t('play.result.status-won')}</p>;
	case contestTypes.Lost:
		return <p style={{ ...styles.base, ...styles.lostColor, ...style }}>{i18n.t('play.result.status-lost')}</p>;
	case contestTypes.Draw:
		return <p style={{ ...styles.base, ...styles.drawColor, ...style }}>{i18n.t('play.result.status-draw')}</p>;
	case contestTypes.Expired:
		return <p style={{ ...styles.base, ...styles.defaultColor, ...style }}>{i18n.t('play.result.status-expired')}</p>;
	case contestTypes.GotDeclined:
		return <p style={{ ...styles.base, ...styles.defaultColor, ...style }}>{i18n.t('play.result.challenge-declined')}</p>;
	case contestTypes.Started:
		return <p style={{ ...styles.base, ...styles.yourTurnColor, ...style }}>{i18n.t('play.result.status-your-turn')}</p>;
	case contestTypes.Challenged:
		return <p style={{ ...styles.base, ...styles.defaultColor, ...style }}>{i18n.t('play.result.status-waiting')}</p>;
	default:
		return <p />;
	}
};

export default getChallengeStatus;
