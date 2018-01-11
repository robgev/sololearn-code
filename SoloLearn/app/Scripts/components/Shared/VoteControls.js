import React from 'react';
import IconButton from 'material-ui/IconButton';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';

import 'styles/voteControls.scss';
import Likes from './Likes';

const VoteControls = ({
	absolute,
	userVote,
	getVotes,
	onUpvote,
	className,
	totalVotes,
	onDownvote,
}) => (
	<div className={`vote-controls ${absolute ? 'absolute-controls' : ''} ${className}`}>
		<IconButton
			className="icon-button up"
			iconStyle={{
				width: 16,
				height: 16,
			}}
			onClick={onUpvote}
		>
			<ThumbUp color={userVote === 1 ? blueGrey500 : grey500} />
		</IconButton>
		<Likes votes={totalVotes} getLikes={getVotes} />
		<IconButton
			className="icon-button down"
			iconStyle={{
				width: 16,
				height: 16,
			}}
			onClick={onDownvote}
		>
			<ThumbDown color={userVote === -1 ? blueGrey500 : grey500} />
		</IconButton>
	</div>
);

export default VoteControls;
