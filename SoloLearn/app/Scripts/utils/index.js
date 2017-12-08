import hmacsha1 from 'hmacsha1';

import Auth from './protected';
import Optional from './optional';
import getOffset from './getOffset';
import redirector from './redirector';
import truncate from './textTruncate';
import getPosition from './getPosition';
import repliesOfId from './repliesOfId';
import toSeoFrendly from './linkPrettify';
import updateDate from './dateFormatter';
import faultGenerator from './faultGenerator';
import updateMessage from './messageFormatter';
import numberFormatter from './numberFormatter';
import getLanguageColor from './getLanguageColor';
import EnumNameMapper from './enumNameMapper';
import getChallengeStatus from './getChallengeStatus';

const hash = pass => hmacsha1('password', pass).slice(0, -1);
const checkWeb = alias => [ 'html', 'css', 'js' ].includes(alias);
const removeDups = array => [ ...new Set(array) ];
const mandatory = () => { throw new Error('Missing parameter'); };

export {
	hash,
	Auth,
	truncate,
	Optional,
	checkWeb,
	getOffset,
	updateDate,
	mandatory,
	redirector,
	getPosition,
	removeDups,
	repliesOfId,
	toSeoFrendly,
	updateMessage,
	faultGenerator,
	numberFormatter,
	getLanguageColor,
	EnumNameMapper,
	getChallengeStatus,
};
