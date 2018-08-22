import { observable, action, computed } from 'mobx';
import Service from 'api/service';
import { filterExisting, groupFeedItems, showError } from 'utils';

class IProfile {
	constructor({ id }) {
		this._profileID = id;
		this.getQuestionsPromise = null;
		this.getCodesPromise = null;
		this.getFeedPromise = null;
		this.getFollowersPromise = null;
		this.getFollowingsPromise = null;
		this.getData();
		this.getQuestions();
		this.getCodes();
		this.getFeed();
	}

	@observable data = {};

	@observable questions = {
		entities: [],
		hasMore: true,
	}

	@observable codes = {
		entities: [],
		hasMore: true,
	}

	@observable followers = {
		entities: [],
		hasMore: true,
	}

	@observable followings = {
		entities: [],
		hasMore: true,
	}

	@observable feed = {
		entities: [],
		hasMore: true,
	}

	@action getData = async () => {
		const { profile } = await Service.request('Profile/GetProfile', { id: this._profileID });
		this.data = profile;
	}

	@action getQuestions = () => {
		if (this.getQuestionsPromise === null) {
			const index = this.questions.entities.length;
			const count = 20;
			this.getQuestionsPromise = Service.request('Discussion/Search', {
				index, profileID: this._profileID, query: '', orderBy: 7, count,
			})
				.then(({ posts }) => {
					if (posts.length < 20) {
						this.questions.hasMore = false;
					}
					const filtered = filterExisting(this.questions.entities, posts);
					this.questions.entities.push(...filtered);
					this.getQuestionsPromise = null;
				});
		}
		return this.getQuestionsPromise;
	}

	@action getCodes = () => {
		if (this.getCodesPromise === null) {
			const index = this.codes.entities.length;
			const count = 20;
			this.getCodesPromise = Service.request('Playground/GetPublicCodes', {
				index, count, orderBy: 3, language: '', query: '', profileID: this._profileID,
			})
				.then(({ codes }) => {
					if (codes.length < count) {
						this.codes.hasMore = false;
					}
					const filtered = filterExisting(this.codes.entities, codes);
					this.codes.entities.push(...filtered);
					this.getCodesPromise = null;
				});
		}
		return this.getCodesPromise;
	}

	@computed get feedFromId() {
		const { entities } = this.feed;
		const lastItem = entities[entities.length - 1];
		return entities.length === 0
			? null
			: lastItem.type === 444
				? lastItem.toId
				: lastItem.id;
	}

	@action getFeed = () => {
		if (this.getFeedPromise === null) {
			const count = 20;
			const { entities } = this.feed;
			this.getFeedPromise = Service.request('Profile/GetFeed', { fromId: this.feedFromId, profileId: this._profileID, count })
				.then(({ feed }) => {
					this.getFeedPromise = null;
					if (feed.length < count) {
						this.feed.hasMore = false;
					}
					const feedItems = groupFeedItems(feed);
					const feedItemsCount = entities.length + feedItems.length;
					const filtered = filterExisting(entities, feedItems);
					this.feed.entities.push(...filtered);
					if (feedItemsCount < count / 2 && this.feed.hasMore) {
						const lastItem = feedItems[feedItems.length - 1];
						if (lastItem !== undefined) {
							this.getFeed();
						}
					}
				});
		}
		return this.getFeedPromise;
	}

	@action getFollowers = () => {
		if (this.getFollowersPromise === null) {
			const index = this.followers.entities.length;
			const count = 20;
			this.getFollowersPromise = Service.request('Profile/GetFollowers', {
				id: this._profileID, index, count,
			})
				.then(({ users }) => {
					if (users.length < count) {
						this.followers.hasMore = false;
					}
					const filtered = filterExisting(this.followers.entities, users);
					this.followers.entities.push(...filtered);
					this.getFollowersPromise = null;
				});
		}
		return this.getFollowersPromise;
	}

	@action getFollowings = () => {
		if (this.getFollowingsPromise === null) {
			const index = this.followings.entities.length;
			const count = 20;
			this.getFollowingsPromise = Service.request('Profile/GetFollowing', {
				id: this._profileID, index, count,
			})
				.then(({ users }) => {
					if (users.length < count) {
						this.followings.hasMore = false;
					}
					const filtered = filterExisting(this.followings.entities, users);
					this.followings.entities.push(...filtered);
					this.getFollowingsPromise = null;
				});
		}
		return this.getFollowingsPromise;
	}

	// Action for following someone is followers/followings list
	@action onFollow = (id) => {
		const follow1 = this.followers.entities.find(el => el.id === id);
		const follow2 = this.followings.entities.find(el => el.id === id);
		const follow = follow1 || follow2;
		const url = follow.isFollowing ? 'Unfollow' : 'Follow';
		Service.request(`Profile/${url}`, { id });
		if (follow1) {
			follow1.isFollowing = !follow1.isFollowing;
		}
		if (follow2) {
			follow2.isFollowing = !follow2.isFollowing;
		}
	}

	// Action for following this.user
	@action onFollowUser = () => {
		const url = this.data.isFollowing ? 'Unfollow' : 'Follow';
		Service.request(`Profile/${url}`, { id: this.data.id })
			.catch(e => showError(e, `Something went wrong when trying to ${url.toLowerCase()}`));
		this.data.isFollowing = !this.data.isFollowing;
	}
}

export default IProfile;
