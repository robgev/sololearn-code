import React from 'react';
import VoteControls from 'components/VoteControls';
import { updateDate } from 'utils';
import { SecondaryTextBlock, Container } from 'components/atoms';
import { VoteActions } from 'components/organisms';

import 'styles/Feed/FeedBottomToolbar.scss';

const FeedToolbar = ({ date }) => (
	<Container className="feed-date-container">
		<SecondaryTextBlock className="date">{updateDate(date)}</SecondaryTextBlock>
	</Container>
);

export default FeedToolbar;
