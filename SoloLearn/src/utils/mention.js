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

const getEntityMapFromRawEditorContent = rawEditorContent =>
	Object.values(rawEditorContent.entityMap);

export const getMentionsFromRawEditorContent = rawEditorContent =>
	Object.values(rawEditorContent.entityMap)
		.map((el, index) => ({ ...el, index }))
		.filter(el => el.type === 'mention')
		.map(el => ({ ...el.data.mention, entityIndex: el.index }));

const _groupEntityMapByBlocks = (blocks, entityMap) => {
	if (blocks.length === 0) {
		return [];
	}
	const [ block, ...tail ] = blocks;
	const entitiesCount = block.entityRanges.length;
	const currentBlockEntities = entityMap
		.slice(0, entitiesCount)
		.map((entity, index) =>
			({ ...entity, ranges: block.entityRanges[index] }));
	const currentBlockWithEntities = {
		...block,
		entities: currentBlockEntities,
	};
	return [
		currentBlockWithEntities,
		..._groupEntityMapByBlocks(tail, entityMap.slice(entitiesCount)),
	];
};

const groupEntityMapByBlocks = (rawEditorContent) => {
	const entityMap = getEntityMapFromRawEditorContent(rawEditorContent);
	const { blocks } = rawEditorContent;
	return _groupEntityMapByBlocks(blocks, entityMap);
};

const getTextFromEntity = (entity) => {
	if (entity.type === 'mention') {
		return `[user id="${entity.data.mention.id}"]${entity.data.mention.name}[/user]`;
	} else if (entity.type === 'emoji') {
		return entity.data.emojiUnicode;
	}
	throw new Error('Entity type mismatch');
};

const _convertBlockToText = (text, entities, initOffset) => {
	// Initial offset is used to take into account the text that has already been converted
	// when calculating the range offset of the entity
	if (entities.length === 0) {
		return text;
	}
	const [ entity, ...tailEntities ] = entities;
	const realOffset = entity.ranges.offset - initOffset;
	const preText = text.slice(0, realOffset);
	const continuationText = text.slice(realOffset + entity.ranges.length);
	const entityText = getTextFromEntity(entity);
	const curr = `${preText}${entityText}`;
	return `${curr}${_convertBlockToText(
		continuationText,
		tailEntities,
		initOffset + text.lastIndexOf(continuationText),
	)}`;
};

const fixRangesOfEntities = (entities) => {
	let emojiCountBefore = 0;
	const fixedEntities = entities.map((entity) => {
		if (entity.type === 'emoji') {
			const fixedEntity = {
				...entity,
				ranges: {
					...entity.ranges,
					offset: entity.ranges.offset + emojiCountBefore,
					length: 2,
				},
			};
			emojiCountBefore++;
			return fixedEntity;
		} else if (entity.type === 'mention') {
			return {
				...entity,
				ranges: {
					...entity.ranges,
					offset: entity.ranges.offset + emojiCountBefore,
				},
			};
		}
		throw new Error('Entity type mismatch');
	});
	return fixedEntities;
};

const convertBlockToText = ({ text, entities }) => {
	const fixedEntities = fixRangesOfEntities(entities);
	return _convertBlockToText(text, fixedEntities, 0);
};

export const getMentionsValue = (rawEditorContent) => {
	const blocksWithEntities = groupEntityMapByBlocks(rawEditorContent);
	const text = blocksWithEntities.reduce((acc, curr) => `${acc}${convertBlockToText(curr).trim()}\n`, '').trim();
	return text;
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
