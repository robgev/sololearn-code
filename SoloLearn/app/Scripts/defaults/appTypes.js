import { EnumNameMapper } from 'utils';

const types = {
	joined: 1,
	badgeUnlocked: 2,
	leveledUp: 3,
	friendJoined: 4,
	following: 5,
	upvote: 6,

	courseStarted: 101,
	moduleCompleted: 102,
	courseCompleted: 103,

	postedQuestion: 201,
	postedAnswer: 202,
	postedComment: 203,
	postedCommentReply: 204,
	upvotePost: 205,
	upvoteComment: 206,

	postedCode: 301,
	upvoteCode: 302,
	postedCodeComment: 303,
	postedCodeCommentReply: 304,
	upvoteCodeComment: 305,

	startedChallange: 401,
	completedChallange: 402,
	challangeReviewRejected: 411,
	challangeReviewPublished: 412,
	mergedChallange: 444,

	suggestions: -1,
};
EnumNameMapper.apply(types);

export default types;
