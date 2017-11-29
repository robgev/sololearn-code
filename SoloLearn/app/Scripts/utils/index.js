import hmacsha1 from 'hmacsha1';
import updateDate from './dateFormatter';
import EnumNameMapper from './enumNameMapper';
import faultGenerator from './faultGenerator';
import getChallengeStatus from './getChallengeStatus';
import getLanguageColor from './getLanguageColor';
import getOffset from './getOffset';
import getPosition from './getPosition';
import toSeoFrendly from './linkPrettify';
import updateMessage from './messageFormatter';
import numberFormatter from './numberFormatter';
import Optional from './optional';
import Auth from './protected';
import redirector from './redirector';
import truncate from './textTruncate';

const hash = pass => hmacsha1('password', pass).slice(0, -1);
const checkWeb = alias => [ 'html', 'css', 'js' ].includes(alias);
const removeDups = array => [ ...new Set(array) ];

export {
	hash,
	Auth,
	truncate,
	Optional,
	checkWeb,
	getOffset,
	updateDate,
	redirector,
	getPosition,
	removeDups,
	toSeoFrendly,
	updateMessage,
	faultGenerator,
	numberFormatter,
	getLanguageColor,
	EnumNameMapper,
	getChallengeStatus,
};
