import React from 'react';
import { numberFormatter } from 'utils';
import { Arrows, Views, Comment } from 'components/icons';
import { IconWithText } from 'components/molecules';
import { FlexBox, SecondaryTextBlock } from 'components/atoms';

import './styles.scss';

const ViewStats = ({	views, votes, comments }) => (
	<FlexBox align>
		{ Number.isInteger(votes) && // Can have negative votes
			<IconWithText justify Icon={Arrows} className="molecule_view-stats">
				<SecondaryTextBlock>{votes > 0 ? `+${numberFormatter(votes)}` : numberFormatter(votes)}</SecondaryTextBlock>
			</IconWithText>
		}
		{ views >= 0 &&
			<IconWithText justify Icon={Views} className="molecule_view-stats">
				<SecondaryTextBlock>{ numberFormatter(views) }</SecondaryTextBlock>
			</IconWithText>
		}
		{ comments >= 0 &&
			<IconWithText justify Icon={Comment} className="molecule_view-stats">
				<SecondaryTextBlock>{ numberFormatter(comments) }</SecondaryTextBlock>
			</IconWithText>
		}
	</FlexBox>
);

export default ViewStats;
