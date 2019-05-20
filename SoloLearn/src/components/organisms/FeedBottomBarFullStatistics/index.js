import React from 'react';
import { updateDate } from 'utils';
import { SecondaryTextBlock, Container, FlexBox } from 'components/atoms';
import { ViewStats } from 'components/molecules';
import { VoteActions } from 'components/organisms';

const FeedBottomBarFullStatistics = ({
	date,
	userVote,
	totalVotes,
	type,
	onChange,
	id,
	className = '',
	views = null,
	comments = null,
}) => (
	<Container className={`feed-toolbar-container ${className}`}>
		<FlexBox>
			<VoteActions
				id={id}
				type={type}
				initialVote={userVote}
				initialCount={totalVotes}
				onChange={onChange}
			/>
			<ViewStats
				views={views}
				comments={comments}
			/>
		</FlexBox>
		<SecondaryTextBlock className="date">{updateDate(date)}</SecondaryTextBlock>
	</Container>
);

export default FeedBottomBarFullStatistics;
