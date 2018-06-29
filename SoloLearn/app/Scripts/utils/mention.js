import React from 'react';
import Service from 'api/service';
import { last } from 'lodash';
import { Link } from 'react-router';

const mentionTypes = {
	discuss: 'Discussion/SearchMentionUsers', // int postId, string query
	lessonComment: 'Discussion/SearchLessonCommentMentionUsers', // int quizId, int type, string query
	codeComment: 'Discussion/SearchCodeCommentMentionUsers', // int codeId, string query
	userLessonComment: 'Discussion/SearchUserLessonCommentMentionUsers', // int lessonId, string query
	postComment: 'Discussion/SearchPostCommentMentionUsers', // int postId, string query
};

export const replaceMention = (text) => {
	let resArr = [ text ];
	const regex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/;
	while (regex.test(last(resArr))) {
		const [ tagged, id, name ] = regex.exec(last(resArr));
		const partial = last(resArr).split(tagged);
		resArr = [ ...resArr.slice(0, resArr.length - 1), partial[0], { id, name, type: 'tag' }, partial[1] ];
	}
	return resArr.map(curr => (curr.type === 'tag'
		? <b key={curr.id}><Link style={{ color: '#0645AD' }} to={`/profile/${curr.id}`}>{curr.name}</Link></b>
		: <span key={curr}>{curr}</span>));
};

export const getMentionsList = (type, params) =>
	async (query) => {
		const { users } = await Service.request(mentionTypes[type], { ...params, query });
		return users;
	};

export const mentionUsers = (text, mentions, ranges) => (ranges.length > 0 ? ranges
	.reduce((acc, curr, idx, arr) => {
		const before = idx === 0
			? text.substring(0, curr.offset)
			: text.substring(arr[idx - 1].offset + arr[idx - 1].length, curr.offset);
		const currentText = `${before}[user id="${mentions[idx].id}"]${text.substr(curr.offset, curr.length)}[/user]`;
		return `${acc}${currentText}${idx === arr.length - 1 ? text.substring(curr.offset + curr.length) : ''}`;
	}, '') : text);

export const getMentionFetcher = (type, id) => {
	switch (type) {
	case 'lesson':
		return getMentionsList('lessonComment', { quizId: id });
	case 'code':
		return getMentionsList('codeComment', { codeId: id });
	case 'userLesson':
		return getMentionsList('userLessonComment', { lessonId: id });
	default:
		throw new Error('Comment type is not defined');
	}
};
