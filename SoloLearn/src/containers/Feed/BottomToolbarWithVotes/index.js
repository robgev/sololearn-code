import React from 'react';
import { FlexBox } from 'components/atoms';
import { VoteActions } from 'components/organisms';

import './styles.scss';

const FeedToolbar = ({
	userVote,
	totalVotes,
	type,
	onChange,
	id,
	className = '',
}) => (
	<FlexBox
		align
		justifyBetween
		className={`feed-btwv-container ${className}`}
	>
		<VoteActions
			id={id}
			type={type}
			initialVote={userVote}
			initialCount={totalVotes}
			onChange={onChange}
		/>
	</FlexBox>
);

export default FeedToolbar;
