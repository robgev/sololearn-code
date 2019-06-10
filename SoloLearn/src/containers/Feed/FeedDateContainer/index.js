import React from 'react';
import { updateDate } from 'utils';
import { SecondaryTextBlock, FlexBox } from 'components/atoms';

import './styles.scss';

const FeedToolbar = ({ date }) => (
	<FlexBox align className="feed-date-container">
		<SecondaryTextBlock className="date">{updateDate(date)}</SecondaryTextBlock>
	</FlexBox>
);

export default FeedToolbar;
