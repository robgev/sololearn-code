import { observable, action } from 'mobx';
import Service from 'api/service';
import { filterExisting } from 'utils';

class ILikes {
	constructor({ type, id }) {
		this.type = type;
		this.id = id;
		this.getUpvotesPromise = null;
		this.getDownvotesPromise = null;
	}

	@observable upvotes = {
		entities: [],
		hasMore: true,
	}

	@action getUpvotes = () => {
		if (this.getUpvotesPromise === null) {
			const { length: index } = this.upvotes.entities;
			const count = 20;
			this.getUpvotesPromise = Service.request(`${this.url}Likes`, { ...this.params, index, count })
				.then(({ users }) => {
					if (users.length < count) {
						this.upvotes.hasMore = false;
					}
					const filtered = filterExisting(this.upvotes.entities, users);
					this.upvotes.entities.push(...filtered);
					this.getUpvotesPromise = null;
				});
		}
		return this.getUpvotesPromise;
	}

	@observable downvotes = {
		entities: [],
		hasMore: true,
	}

	@action getDownvotes = () => {
		if (this.getDownvotesPromise === null) {
			const { length: index } = this.downvotes.entities;
			const count = 20;
			this.getDownvotesPromise = Service.request(`${this.url}Downvotes`, { ...this.params, index, count })
				.then(({ users }) => {
					if (users.length < count) {
						this.downvotes.hasMore = false;
					}
					const filtered = filterExisting(this.downvotes.entities, users);
					this.downvotes.entities.push(...filtered);
					this.getDownvotesPromise = null;
				});
		}
		return this.getDownvotesPromise;
	}

	@action onFollow = (id) => {
		const follow = this.upvotes.entities.find(el => el.id === id)
			|| this.downvotes.entities.find(el => el.id === id);
		const url = follow.isFollowing ? 'Unfollow' : 'Follow';
		Service.request(`Profile/${url}`, { id });
		follow.isFollowing = !follow.isFollowing;
	}

	get params() {
		switch (this.type) {
		case 'code':
			return { codeId: this.id };
		case 'post':
			return { postId: this.id };
		case 'lessonComment':
		case 'codeComment':
		case 'userLessonComment':
			return { commentId: this.id };
		default:
			throw new Error('Couldn\'t find likes type');
		}
	}

	get url() {
		// Get the url without specifying likes or downvotes
		switch (this.type) {
		case 'code':
			return 'Playground/GetCode';
		case 'post':
			return 'Discussion/GetPost';
		case 'lessonComment':
			return 'Discussion/GetLessonComment';
		case 'codeComment':
			return 'Discussion/GetCodeComment';
		case 'userLessonComment':
			return 'Discussion/GetUserLessonComment';
		default:
			throw new Error('Couldn\'t find likes type');
		}
	}
}

export default ILikes;
