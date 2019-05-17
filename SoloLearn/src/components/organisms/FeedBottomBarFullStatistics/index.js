import React from './node_modules/react';
import { updateDate } from './node_modules/utils';
import { SecondaryTextBlock, Container, FlexBox } from './node_modules/components/atoms';
import { ViewStats } from './node_modules/components/molecules';
import { VoteActions } from './node_modules/components/organisms';

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
