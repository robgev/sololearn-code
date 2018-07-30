import Service from 'api/service';
import getLikes from 'actions/likes';

export default
	class CommentsAPI {
	constructor({
		commentsType, type = null, id, orderBy, findPostId = null,
	}) {
		this.commentsType = commentsType;
		this.params = CommentsAPI.getParamsByType({ id, type, commentsType });
		this.orderBy = orderBy;
		this.findPostId = findPostId;
		this.getCommentsPromise = null;
	}

	static getParamsByType = ({
		id, type, commentsType,
	}) => {
		switch (commentsType) {
			case 'lesson':
				return { quizId: id, type };
			case 'code':
				return { codeId: id };
			case 'userLesson':
				return { lessonId: id };
			default:
				return null;
		}
	};

	getComments = ({
		index, count = 20, parentID = null,
	}) => {
		// Block fetching twice with the same properties
		if (this.getCommentsPromise === null) {
			const params = {
				...this.params, index, orderBy: this.orderBy, count, parentID, findPostId: this.findPostId,
			};
			this.getCommentsPromise = Service
				.request(`Discussion/Get${this.commentsType}Comments`, params)
				.then((resp) => {
					this.getCommentsPromise = null;
					if (resp.error) {
						throw resp.error;
					}
					return resp.comments;
				});
		}
		return this.getCommentsPromise;
	};

	voteComment = ({ id, vote }) =>
		Service.request(`Discussion/Vote${this.commentsType}Comment`, { id, vote });

	editComment = ({ id, message }) =>
		Service.request(`Discussion/Edit${this.commentsType}Comment`, { id, message });

	deleteComment = ({ id }) =>
		Service.request(`Discussion/Delete${this.commentsType}Comment`, { id });

	addComment = ({
		parentID = null, message,
	}) => {
		const params = {
			...this.params, parentID, message, orderBy: this.orderBy,
		};
		return Service.request(`Discussion/Create${this.commentsType}Comment`, params);
	};

	getVotesList = ({ id, type }) =>
		getLikes(`${this.commentsType}Comment${type}`, id);

	orderComments = (comments, orderBy = this.orderBy) => {
		switch (orderBy) {
			case 1: // Sort by date
				return comments.slice().sort((a, b) => new Date(b.date) - new Date(a.date));
			case 2:
				return comments.slice().sort((a, b) => b.votes - a.votes);
			default:
				throw new Error('Unknown comment ordering');
		}
	}

	requestRemoval = ({ itemId, itemType }) => {
		Service.request('ReportItem', {
			itemType,
			reason: 100, // Server reason for moderator prompt.
			itemId,
		});
	}

	get getMentionUsers() {
		return { type: `${this.commentsType}Comment`, params: this.params };
	}
}
