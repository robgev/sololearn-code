import React from 'react';
import { updateDate } from 'utils';
import { SecondaryTextBlock, Container } from 'components/atoms';
import { VoteActions } from 'components/organisms';

import 'styles/Feed/FeedBottomToolbar.scss';

const FeedToolbar = ({
	date,
	userVote,
	totalVotes,
	type,
	onChange,
	id,
	className = '',
}) => (
	<Container className={`feed-toolbar-container ${className}`}>
		<VoteActions
			id={id}
			type={type}
			initialVote={userVote}
			initialCount={totalVotes}
			onChange={onChange}
		/>
		<SecondaryTextBlock className="date">{updateDate(date)}</SecondaryTextBlock>
	</Container>
);

export default FeedToolbar;
