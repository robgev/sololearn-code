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
import generatePreviews from './generatePreviews';
import numberFormatter from './numberFormatter';
import getLanguageColor from './getLanguageColor';
import calculateProgress from './calculateProgress';
import EnumNameMapper from './enumNameMapper';
import findCommonPrefix from './findCommonPrefix';
import getChallengeStatus from './getChallengeStatus';
import getCourseAliasById from './getCourseAliasById';
import determineAccessLevel from './determineAccessLevel';

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
	generatePreviews,
	numberFormatter,
	calculateProgress,
	getLanguageColor,
	EnumNameMapper,
	findCommonPrefix,
	getChallengeStatus,
	getCourseAliasById,
	determineAccessLevel,
};
