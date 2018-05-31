import React from 'react';
import VoteControls from 'components/Shared/VoteControls';
import { updateDate } from 'utils';

import 'styles/Feed/FeedBottomToolbar.scss';

const FeedToolbar = ({
	date,
	userVote,
	onUpvote,
	totalVotes,
	onDownvote,
}) => (
	<div className="feed-toolbar-container">
		<VoteControls
			absolute
			userVote={userVote}
			onUpvote={onUpvote}
			totalVotes={totalVotes}
			onDownvote={onDownvote}
		/>
		<p className="date">{updateDate(date)}</p>
	</div>
);

export default FeedToolbar;
