import { observable, action } from 'mobx';
import Service from 'api/service';
import { filterExisting } from 'utils';

class ILikes {
	constructor({
		type, id, userVote, voteCount,
	}) {
		this.type = type;
		this.id = id;
		this.userVote = userVote;
		this.voteCount = voteCount;
		this.getUpvotesPromise = null;
		this.getDownvotesPromise = null;
	}

	@observable userVote;

	@observable voteCount;

	@action empty = () => {
		this.upvotes.entities = [];
		this.upvotes.hasMore = true;
		this.downvotes.entities = [];
		this.downvotes.hasMore = true;
	}

	@observable upvotes = {
		entities: [],
		hasMore: true,
	}

	@action getUpvotes = () => {
		if (this.getUpvotesPromise === null) {
			const { length: index } = this.upvotes.entities;
			const count = 20;
			this.getUpvotesPromise = Service.request(`${this.url('Get')}Likes`, { ...this.params, index, count })
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
			this.getDownvotesPromise = Service.request(`${this.url('Get')}Downvotes`, { ...this.params, index, count })
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

	@action vote = ({ newVote }) => {
		const initialVoteCount = this.voteCount;
		const initialUserVote = this.userVote;

		const vote = initialUserVote === newVote ? 0 : newVote;
		this.voteCount = (initialVoteCount + vote) - initialUserVote;
		this.userVote = vote;
		return Service.request(`${this.url('Vote')}`, { id: this.id, vote: this.userVote })
			.catch((resp) => {
				this.voteCount = initialVoteCount;
				this.userVote = initialUserVote;
				throw resp;
			});
	}

	get params() {
		switch (this.type) {
		case 'code':
			return { codeId: this.id };
		case 'post':
		case 'userPost':
			return { postId: this.id };
		case 'lessonComment':
		case 'codeComment':
		case 'userLessonComment':
		case 'postComment':
			return { commentId: this.id };
		default:
			throw new Error('Couldn\'t find likes type');
		}
	}

	url(act) {
		// Get the url without specifying likes or downvotes
		switch (this.type) {
		case 'code':
			return `Playground/${act}Code`;
		case 'post':
			return `Discussion/${act}Post`;
		case 'userPost':
			return `Profile/${act}Post`;
		case 'lessonComment':
			return `Discussion/${act}LessonComment`;
		case 'codeComment':
			return `Discussion/${act}CodeComment`;
		case 'userLessonComment':
			return `Discussion/${act}UserLessonComment`;
		case 'postComment':
			return `Discussion/${act}PostComment`;
		default:
			throw new Error('Couldn\'t find likes type');
		}
	}
}

export default ILikes;
