import React from 'react';
import { updateDate } from 'utils';
import { SecondaryTextBlock, Container } from 'components/atoms';

import 'styles/Feed/FeedBottomToolbar.scss';

const FeedToolbar = ({ date }) => (
	<Container className="feed-date-container">
		<SecondaryTextBlock className="date">{updateDate(date)}</SecondaryTextBlock>
	</Container>
);

export default FeedToolbar;
