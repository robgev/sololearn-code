import { observable, action, computed } from 'mobx';
import Service from 'api/service';
import { filterExisting, groupFeedItems, showError, forceOpenFeed } from 'utils';
import feedTypes from 'defaults/appTypes';

class IProfile {
	constructor({ id, isMe }) {
		this._profileID = id;
		this._isMe = isMe;
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

	@observable followEntities = {}

	@observable followersRaw = {
		ids: [],
		hasMore: true,
	}

	@computed get followers() {
		const entities = this.followersRaw.ids.map(id => this.followEntities[id]);
		const { hasMore } = this.followersRaw;
		return { entities, hasMore };
	}

	@observable followingsRaw = {
		ids: [],
		hasMore: true,
	}

	@computed get followings() {
		const entities = this.followingsRaw.ids.map(id => this.followEntities[id]);
		const { hasMore } = this.followingsRaw;
		return { entities, hasMore };
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
					const isFirstItemGrouppedChallenge =
						entities.length === 0
						&& feedItems.length
						&& feedItems[0].type === feedTypes.mergedChallange;
					const forceOpenedFeed = isFirstItemGrouppedChallenge
						? forceOpenFeed(feedItems[0])
						: feedItems;
					const feedItemsCount = entities.length + forceOpenedFeed.length;
					const filtered = filterExisting(entities, forceOpenedFeed);
					this.feed.entities.push(...filtered);
					if (feedItemsCount < count / 2 && this.feed.hasMore) {
						const lastItem = forceOpenedFeed[forceOpenedFeed.length - 1];
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
			const index = this.followersRaw.ids.length;
			const count = 20;
			this.getFollowersPromise = Service.request('Profile/GetFollowers', {
				id: this._profileID, index, count,
			})
				.then(({ users }) => {
					if (users.length < count) {
						this.followersRaw.hasMore = false;
					}
					users.forEach((user) => {
						this.followEntities[user.id] = user;
						if (!this.followersRaw.ids.includes(user.id)) {
							this.followersRaw.ids.push(user.id);
						}
					});
					this.getFollowersPromise = null;
				});
		}
		return this.getFollowersPromise;
	}

	@action getFollowings = () => {
		if (this.getFollowingsPromise === null) {
			const index = this.followingsRaw.ids.length;
			const count = 20;
			this.getFollowingsPromise = Service.request('Profile/GetFollowing', {
				id: this._profileID, index, count,
			})
				.then(({ users }) => {
					if (users.length < count) {
						this.followingsRaw.hasMore = false;
					}
					users.forEach((user) => {
						this.followEntities[user.id] = user;
						if (!this.followingsRaw.ids.includes(user.id)) {
							this.followingsRaw.ids.push(user.id);
						}
					});
					this.getFollowingsPromise = null;
				});
		}
		return this.getFollowingsPromise;
	}

	// Action for following someone is followers/followings list
	@action onFollow = (id) => {
		const shouldFollow = !this.followEntities[id].isFollowing;
		Service.request(`Profile/${shouldFollow ? 'Follow' : 'Unfollow'}`, { id });
		this.followEntities[id].isFollowing = shouldFollow;
		if (this._isMe && shouldFollow) {
			this.followingsRaw.ids.unshift(id);
		}
	}

	// Action for following this.user
	@action onFollowUser = () => {
		const url = this.data.isFollowing ? 'Unfollow' : 'Follow';
		Service.request(`Profile / ${url} `, { id: this.data.id })
			.catch(e => showError(e, `Something went wrong when trying to ${url.toLowerCase()} `));
		this.data.followers += this.data.isFollowing ? -1 : 1;
		this.data.isFollowing = !this.data.isFollowing;
	}

	@action clearFollowData = () => {
		this.followersRaw.ids = [];
		this.followersRaw.hasMore = true;
		this.followingsRaw.ids = [];
		this.followingsRaw.hasMore = true;
		this.followEntities = {};
	}
}

export default IProfile;
