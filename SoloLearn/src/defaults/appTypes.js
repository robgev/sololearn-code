import { EnumNameMapper } from 'utils';

const types = {
	joined: 1,
	badgeUnlocked: 2,
	leveledUp: 3,
	friendJoined: 4,
	following: 5,
	upvote: 6,

	userPost: 20,

	courseStarted: 101,
	moduleCompleted: 102,
	courseCompleted: 103,
	lessonCreated: 111,
	postedUserLessonComment: 113,
	postedUserLessonCommentReply: 114,
	upvoteUserLessonComment: 115,

	lessonReviewRejected: 121,
	lessonReviewPublished: 122,

	postedQuestion: 201,
	postedAnswer: 202,
	postedLessonComment: 203,
	postedLessonCommentReply: 204,
	upvotePost: 205,
	upvoteComment: 206,
	mentionPost: 208,

	postedCode: 301,
	upvoteCode: 302,
	postedCodeComment: 303,
	postedCodeCommentReply: 304,
	upvoteCodeComment: 305,
	mentionCodeComment: 309,

	startedChallange: 401,
	completedChallange: 402,
	challangeReviewRejected: 411,
	challangeReviewPublished: 412,
	mergedChallange: 444,

	suggestions: -1,
};
EnumNameMapper.apply(types);

export default types;
