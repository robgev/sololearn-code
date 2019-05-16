import hmacsha1 from 'hmacsha1';

import Optional from './optional';
import showError from './showError';
import truncate from './textTruncate';
import getPosition from './getPosition';
import repliesOfId from './repliesOfId';
import toSeoFriendly from './linkPrettify';
import findBestRank from './findBestRank';
import updateDate from './updateDate';
import faultGenerator from './faultGenerator';
import generatePreviews from './generatePreviews';
import numberFormatter from './numberFormatter';
import getLanguageColor from './getLanguageColor';
import calculateProgress from './calculateProgress';
import findCommonPrefix from './findCommonPrefix';
import getChallengeStatus from './getChallengeStatus';
import determineAccessLevel from './determineAccessLevel';
import determineBadge from './modBadgeUtils';

export {
	replaceMention,
	getMentionsList,
	mentionUsers,
	getMentionsFromRawEditorContent,
	getMentionsValue,
	makeEditableContent,
} from './mention';
export { default as getCommonPrefix } from './getCommonPrefix';
export { default as filterExisting } from './filterExisting';
export { default as EnumNameMapper } from './enumNameMapper';
export { default as groupFeedItems, forceOpenFeed } from './groupFeedItems';
export { default as Loadable } from './Loadable';
export { default as redirector } from './redirector';
export { default as queryDifference } from './queryDifference';
export { default as isObjectEqual } from './isObjectEqual';
export { default as normalize } from './normalizr';
export { default as stopPropagation } from './stopPropagation';
export { default as getCountryName } from './getCountryName';

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
	showError,
	updateDate,
	mandatory,
	getPosition,
	removeDups,
	repliesOfId,
	findBestRank,
	shuffleArray,
	toSeoFriendly,
	faultGenerator,
	determineBadge,
	generatePreviews,
	numberFormatter,
	calculateProgress,
	getLanguageColor,
	findCommonPrefix,
	getChallengeStatus,
	determineAccessLevel,
};
