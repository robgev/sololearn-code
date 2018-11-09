import Service from 'api/service';
import { observable, action, reaction, computed } from 'mobx';

class IPost {
	static ORDER_BY_VOTE = 1;
	static ORDER_BY_DATE = 2;

	constructor({ id }) {
		this.id = id;
		this.dispose = reaction(
			() => this.repliesOrderBy,
			() => {
				this.clearReplies();
				this.getReplies();
			},
		);
	}

	@observable getPostPromise = null;

	@computed get isFetching() {
		return this.getPostPromise !== null;
	}

	@observable data = null;

	@computed get count() {
		if (this.data === null) {
			return null;
		}
		return this.data.answers;
	}

	@action handleGottenPost = ({ post }) => {
		this.data = post;
		return post;
	}

	@action endGetPostRequest = (res) => {
		// Need to get in Post.js to update route
		this.getPostPromise = null;
		return res;
	}

	@action getPost = () => {
		if (this.getPostPromise === null) {
			this.getPostPromise = Service.request('Discussion/GetPost', { id: this.id })
				.then(this.handleGottenPost)
				.finally(this.endGetPostRequest);
		}
		return this.getPostPromise;
	}

	@action onFollow = () => {
		this.data.isFollowing = !this.data.isFollowing;
		const urlOption = this.data.isFollowing ? 'Follow' : 'Unfollow';
		Service.request(`Discussion/${urlOption}`, { id: this.data.id })
			.then(() => this.data.isFollowing);
	}
}

export default IPost;
