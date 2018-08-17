import React from 'react';
import IconButton from 'material-ui/IconButton';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

import 'styles/voteControls.scss';
import Likes from './Likes';

const VoteControls = ({
	absolute,
	userVote,
	onUpvote,
	className,
	totalVotes,
	onDownvote,
	buttonStyle,
	id,
	type,
}) => (
	<div className={`vote-controls ${absolute ? 'absolute-controls' : ''} ${className}`}>
		<IconButton
			className="icon-button up"
			style={{
				width: 32,
				height: 32,
				padding: 4,
				...buttonStyle,
			}}
			iconStyle={{
				width: 24,
				height: 24,
			}}
			onClick={onUpvote}
		>
			<ArrowUp color={userVote === 1 ? blueGrey500 : grey500} />
		</IconButton>
		<Likes
			votes={totalVotes}
			id={id}
			type={type}
		/>
		<IconButton
			className="icon-button down"
			style={{
				width: 32,
				height: 32,
				padding: 4,
				...buttonStyle,
			}}
			iconStyle={{
				width: 24,
				height: 24,
			}}
			onClick={onDownvote}
		>
			<ArrowDown color={userVote === -1 ? blueGrey500 : grey500} />
		</IconButton>
	</div>
);

export default VoteControls;
