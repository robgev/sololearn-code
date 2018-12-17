import React from 'react';
import { updateDate } from 'utils';
import { Date } from 'components/icons';
import { SecondaryTextBlock } from 'components/atoms';
import { IconWithText } from 'components/molecules';

const DateInfo = ({	date }) => (
	<IconWithText justify Icon={Date} className="molecule_view-stats">
		<SecondaryTextBlock>{ updateDate(date) }</SecondaryTextBlock>
	</IconWithText>
);

export default DateInfo;
