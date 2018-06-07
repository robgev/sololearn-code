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

export const setMention = (text, name, id, replacable) => text.replace(replacable, `[user id="${id}"]${name}[/user]`);

export const getMentionsList = (type, params) => Service.request(mentionTypes[type], params);
