import React from 'react';
import Service from 'api/service';
import last from 'lodash/last';
import { Link } from 'react-router';
import { ContentState, convertToRaw, SelectionState, Modifier } from 'draft-js';

const mentionTypes = {
	discuss: 'Discussion/SearchMentionUsers', // int postId, string query
	lessonComment: 'Discussion/SearchLessonCommentMentionUsers', // int quizId, int type, string query
	codeComment: 'Discussion/SearchCodeCommentMentionUsers', // int codeId, string query
	userLessonComment: 'Discussion/SearchUserLessonCommentMentionUsers', // int lessonId, string query
	postComment: 'Discussion/SearchPostCommentMentionUsers', // int postId, string query
	userPost: 'Discussion/SearchPostCommentMentionUsers',
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
		? <b key={curr.id}><Link className="hoverable" style={{ color: '#0645AD' }} to={`/profile/${curr.id}`}>{curr.name}</Link></b>
		: <span key={curr}>{curr}</span>));
};

export const getMentionsList = ({ type, params = {} }) =>
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

export const getMentionsFromRawEditorContent = rawEditorContent =>
	Object.values(rawEditorContent.entityMap)
		.map(el => el.data.mention);

export const getMentionsValue = (rawEditorContent) => {
	const { blocks } = rawEditorContent;
	const mentions = getMentionsFromRawEditorContent(rawEditorContent);
	const { result } = blocks.reduce((acc, curr) => {
		const { text, entityRanges } = curr;
		const mentionIndex = acc.mentionIndex + entityRanges.length;
		const lineMentions = mentions.slice(acc.mentionIndex, mentionIndex);
		return { result: `${acc.result}${mentionUsers(text, lineMentions, entityRanges)}\n`, mentionIndex };
	}, { result: '', mentionIndex: 0 });
	return result.trim();
};

export const makeEditableContent = (text) => {
	const allMentionsRegex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/g;
	const singleMentionRegex = /\[user id ?= ?"?(\d+)"?\](.+?)\[\/user\]/;
	let contentState = ContentState.createFromText(text);
	const { blocks } = convertToRaw(contentState);
	blocks.forEach(({ key: currBlockKey, text: initBlockText }) => {
		const slots = initBlockText.match(allMentionsRegex) || [];
		slots.forEach((slot) => {
			// as current block text can change we need to get it each time
			const { text: blockText } = contentState.getBlockForKey(currBlockKey);
			const [ , id, name ] = slot.match(singleMentionRegex);
			const contentStateWithEntity = contentState.createEntity(
				'mention',
				'SEGMENTED',
				{ mention: { id, name } },
			);
			const entityKey = contentStateWithEntity.getLastCreatedEntityKey();
			const selectionState = SelectionState.createEmpty(currBlockKey).merge({
				anchorOffset: blockText.indexOf(slot),
				focusOffset: blockText.indexOf(slot) + slot.length,
			});
			contentState = Modifier.replaceText(
				contentStateWithEntity,
				selectionState,
				name,
				null,
				entityKey,
			);
		});
	});
	return contentState;
};
