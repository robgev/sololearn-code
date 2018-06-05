import Service from 'api/service';
import { last } from 'lodash';

const mentionTypes = {
	discuss: 'Discussion/SearchMentionUsers',
	lessonComment: 'Discussion/SearchLessonCommentMentionUsers',
	codeComment: 'Discussion/SearchCodeCommentMentionUsers',
	userLessonComment: 'Discussion/SearchUserLessonCommentMentionUsers',
	postComment: 'Discussion/SearchPostCommentMentionUsers',
};

export const replaceMention = (text) => {
	let resArr = [ text ];
	const regex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/;
	while (regex.test(last(resArr))) {
		const [ tagged, id, name ] = regex.exec(last(resArr));
		const partial = last(resArr).split(tagged);
		resArr = [ ...resArr.slice(0, resArr.length - 1), partial[0], { id, name, tag: 'user' }, partial[1] ];
	}
	return resArr;
};

export const getMentions = (type, params) => Service.request(mentionTypes[type], params);

// Handle any tag without regexp

// const getTag = (text, tag) => {
// 	const endIndex = text.indexOf(`[/${tag}]`);
// 	if (endIndex === -1) return null;
// 	const startIndex = text.indexOf(`[${tag}`);
// 	const tagged = text.substring(startIndex, endIndex + tag.length + 3);
// 	const children = tagged.substring(tagged.indexOf(']') + 1, tagged.indexOf(`[/${tag}`));
// 	const attrString = tagged.substring(2 + tag.length, tagged.indexOf(']'));
// 	const attrArr = attrString.split(' ');
// 	const attributes = {};
// 	attrArr.forEach((el) => {
// 		const name = el.substring(0, el.indexOf('='));
// 		const val = el.substring(el.indexOf('"') + 1, el.length - 1);
// 		attributes[name] = val;
// 	});
// 	return [ text.split(tagged)[0], { attributes, children, tag }, text.split(tagged)[1] ];
// };

// export const getTags = (text, tag) => {
// 	let resArr = [ text ];
// 	while (getTag(resArr[resArr.length - 1], tag) !== null) {
// 		resArr = [ ...resArr.slice(0, resArr.length - 1), ...getTag(resArr[resArr.length - 1], tag) ];
// 	}
// 	return resArr;
// };
