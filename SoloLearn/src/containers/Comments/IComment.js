import { extendObservable } from 'mobx';

class CommentItem {
	constructor(c) {
		extendObservable(
			this,
			{
				replies:
					c.replies,
				vote:
					c.vote,
				message:
					c.message,
				votes:
					c.votes,
				repliesArray:
					c.repliesArray,
			},
		);
		this.id =
			c.id;
		this.level =
			c.level;
		this.parentID =
			c.parentID;
		this.avatarUrl =
			c.avatarUrl;
		this.userName =
			c.userName;
		this.badge =
			c.badge;
		this.userID =
			c.userID;
		this.date =
			c.date;
		this.index =
			c.index;
	}
}

export default CommentItem;
