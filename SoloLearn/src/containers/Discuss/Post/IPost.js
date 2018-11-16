import Service from 'api/service';
import { observable, action, computed } from 'mobx';

class IPost {
	static ORDER_BY_VOTE = 1;
	static ORDER_BY_DATE = 2;

	constructor({ id }) {
		this.id = id;
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

	@action changeCount = (countChange) => {
		this.data.answers += countChange;
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
		Service.request(`Discussion/${urlOption}Post`, { id: this.data.id })
			.then(() => this.data.isFollowing);
	}

	deletePost = () => Service.request('Discussion/DeletePost', { id: this.id }).then(() => this.id)
}

export default IPost;
