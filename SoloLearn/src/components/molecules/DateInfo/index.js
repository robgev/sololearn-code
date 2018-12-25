import React from 'react';
import { updateDate } from 'utils';
import { Date } from 'components/icons';
import { IconLabel } from 'components/atoms';
import { IconWithText } from 'components/molecules';

const DateInfo = ({	date }) => (
	<IconWithText justify Icon={Date} className="molecule_view-stats">
		<IconLabel>{ updateDate(date) }</IconLabel>
	</IconWithText>
);

export default DateInfo;
