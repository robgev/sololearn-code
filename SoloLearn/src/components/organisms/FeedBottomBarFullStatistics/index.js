import React from 'react';
import { updateDate } from 'utils';
import { SecondaryTextBlock, Container, FlexBox } from 'components/atoms';
import { ViewStats } from 'components/molecules';
import { VoteActions } from 'components/organisms';

import './styles.scss';

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
	withDate = true,
	commentIconLink,
}) => (
	<Container className={`feed-bbfs-container ${className}`}>
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
				link={commentIconLink}
				className="feed-bbfs_view-stats"
			/>
		</FlexBox>
		{withDate ? <SecondaryTextBlock className="date">{updateDate(date)}</SecondaryTextBlock> : null}
	</Container>
);

export default FeedBottomBarFullStatistics;
