import hmacsha1 from 'hmacsha1';

import Optional from './optional';
import getOffset from './getOffset';
import showError from './showError';
import truncate from './textTruncate';
import getPosition from './getPosition';
import repliesOfId from './repliesOfId';
import toSeoFriendly from './linkPrettify';
import findBestRank from './findBestRank';
import updateDate from './dateFormatter';
import faultGenerator from './faultGenerator';
import updateMessage from './messageFormatter';
import generatePreviews from './generatePreviews';
import numberFormatter from './numberFormatter';
import getLanguageColor from './getLanguageColor';
import calculateProgress from './calculateProgress';
import findCommonPrefix from './findCommonPrefix';
import getChallengeStatus from './getChallengeStatus';
import getCourseNameById from './getCourseNameById';
import determineAccessLevel from './determineAccessLevel';
import determineBadge, { determineBadgeColor } from './modBadgeUtils';

export { replaceMention, getMentionsList, mentionUsers } from './mention';
export { default as getCommonPrefix } from './getCommonPrefix';
export { default as filterExisting } from './filterExisting';
export { default as EnumNameMapper } from './enumNameMapper';
export { default as groupFeedItems } from './groupFeedItems';
export { default as Loadable } from './Loadable';
export { default as redirector } from './redirector';
export { default as objectDifference } from './objectDifference';

const hash = pass => hmacsha1('password', pass).slice(0, -1);
const checkWeb = alias => [ 'html', 'css', 'js' ].includes(alias);
const removeDups = array => [ ...new Set(array) ];
const mandatory = () => { throw new Error('Missing parameter'); };
const shuffleArray = arr =>
	arr.map(a => [ Math.random(), a ]).sort((a, b) => a[0] - b[0]).map(a => a[1]);

export {
	hash,
	truncate,
	Optional,
	checkWeb,
	getOffset,
	showError,
	updateDate,
	mandatory,
	getPosition,
	removeDups,
	repliesOfId,
	findBestRank,
	toSeoFriendly,
	shuffleArray,
	updateMessage,
	faultGenerator,
	determineBadge,
	generatePreviews,
	numberFormatter,
	calculateProgress,
	getLanguageColor,
	findCommonPrefix,
	getChallengeStatus,
	getCourseNameById,
	determineBadgeColor,
	determineAccessLevel,
};
