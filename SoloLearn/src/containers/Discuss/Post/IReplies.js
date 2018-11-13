import Service from 'api/service';
import { observable, action, reaction, computed } from 'mobx';
import maxBy from 'lodash/maxBy';
import minBy from 'lodash/minBy';
import uniqBy from 'lodash/uniqBy';

class IReplies {
	static FETCH_COUNT = 20;

	static ORDER_BY_VOTE = 1;
	static ORDER_BY_DATE = 2;

	constructor({
		postID, userInfo,
	}) {
		this.postID = parseInt(postID, 10);
		// Have to give this to replies the current user makes { userName, avatarUrl }
		this.userInfo = userInfo;
		this.dispose = reaction(
			() => this.orderBy,
			() => {
				this.reset();
			},
		);
	}

	reset = () => {
		this.clearReplies();
		this.initial({ findPostID: null });
	}

	initial = ({ findPostID }) => {
		if (findPostID === null) {
			return this.getReplies();
		}
		return this.getRepliesByID(findPostID);
	}

	addReply = (message) => {
		const { postID } = this;
		return Service.request('Discussion/CreateReply', { postID, message })
			.then(this.handleAddedReply);
	}

	@observable orderBy = IReplies.ORDER_BY_VOTE;

	@observable entities = [];

	@observable hasMore = true;

	@observable getRepliesPromise = null;

	@computed get isFetching() {
		return this.getRepliesPromise !== null;
	}

	@computed get canLoadAbove() {
		return this.entities.length > 0 && this.hasMore && this.firstIndex > 0;
	}

	@action setOrderBy = (orderBy) => {
		if (orderBy !== this.orderBy) {
			this.orderBy = orderBy;
		}
	}

	@action clearReplies = () => {
		this.entities = [];
		this.hasMore = true;
	}

	@computed get lastIndex() {
		const post = maxBy(this.entities, entity => entity.index);
		return post !== undefined ? post.index : -1;
	}

	@computed get firstIndex() {
		const post = minBy(this.entities, entity => entity.index);
		return post !== undefined ? post.index : 0;
	}

	@action handleGottenReplies = ({ posts }) => {
		if (posts.length < IReplies.FETCH_COUNT) {
			this.hasMore = false;
		}
		this.entities = this.concatRepliesByOrder(this.entities, posts, this.orderBy);
	}

	@action endGetRepliesRequest = () => {
		this.getRepliesPromise = null;
	}

	@action handleAddedReply = ({ post }) => {
		const withUserInfo = { ...post, ...this.userInfo, vote: 0 };
		this.entities = this.concatRepliesByOrder(this.entities, [ withUserInfo ], this.orderBy);
	}

	concatRepliesByOrder = (oldReplies, newReplies, orderBy) => {
		const replies = uniqBy([ ...oldReplies, ...newReplies ], reply => reply.id);
		switch (orderBy) {
		case IReplies.ORDER_BY_VOTE:
			return replies.slice().sort((a, b) => a.isAccepted ? -1 : b.votes - a.votes);
		case IReplies.ORDER_BY_DATE:
			return replies.slice().sort((a, b) => a.isAccepted ? -1 : new Date(b.date) - new Date(b.date));
		default:
			throw new Error('Couldn\'t identify replies order');
		}
	}

	@action getRepliesByID = (findPostID) => {
		if (this.getRepliesPromise === null) {
			const count = IReplies.FETCH_COUNT;
			const { postID } = this;
			const orderBy = 7;
			this.getRepliesPromise = Service.request(
				'Discussion/GetReplies',
				{
					count, orderBy, postID, findPostID,
				},
			)
				.then(this.handleGottenReplies)
				.finally(this.endGetRepliesRequest);
		}
		return this.getRepliesPromise;
	}

	@action getReplies = () => {
		if (this.getRepliesPromise === null) {
			const count = IReplies.FETCH_COUNT;
			const { orderBy, postID } = this;
			const index = this.lastIndex + 1;
			this.getRepliesPromise = Service.request(
				'Discussion/GetReplies',
				{
					count, orderBy, postID, index,
				},
			)
				.then(this.handleGottenReplies)
				.finally(this.endGetRepliesRequest);
		}
		return this.getRepliesPromise;
	};

	@action getRepliesAbove = () => {
		if (this.getRepliesPromise === null) {
			const { firstIndex, orderBy, postID } = this;
			const index = firstIndex >= 20 ? firstIndex - 20 : 0;
			const count = index === 0 ? firstIndex : IReplies.FETCH_COUNT;
			this.getRepliesPromise = Service.request(
				'Discussion/GetReplies',
				{
					count, orderBy, postID, index,
				},
			)
				.then(this.handleGottenReplies)
				.finally(this.endGetRepliesRequest);
		}
	}

	@action removeReply = (id) => {
		this.entities = this.entities.filter(reply => reply.id !== id);
	}

	@action onAcceptReply = id => {
		const reply = this.entities.find(reply => reply.id === id);
		reply.isAccepted = !reply.isAccepted;
		Service.request('Discussion/ToggleAcceptedAnswer', { id, accepted: !reply.isAccepted });
	}

	deleteReply = id =>
		Service.request('Discussion/DeletePost', { id })
			.then(() => this.removeReply(id))
}

export default IReplies;
