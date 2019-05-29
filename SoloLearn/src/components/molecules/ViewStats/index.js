import React from 'react';
import { numberFormatter } from 'utils';
import { Arrows, Views, Comment } from 'components/icons';
import { IconWithText, ContainerLink } from 'components/molecules';
import { FlexBox, IconLabel } from 'components/atoms';

import './styles.scss';

const ViewStats = ({
	views, votes, comments, link,
}) => (
	<FlexBox align>
		{Number.isInteger(votes) && // Can have negative votes
			<IconWithText justify Icon={Arrows} className="molecule_view-stats">
				<IconLabel>{votes > 0 ? `+${numberFormatter(votes)}` : numberFormatter(votes)}</IconLabel>
			</IconWithText>
		}
		{views >= 0 &&
			<IconWithText justify Icon={Views} className="molecule_view-stats">
				<IconLabel>{numberFormatter(views)}</IconLabel>
			</IconWithText>
		}
		{comments >= 0 &&
			<ContainerLink to={link}>
				<IconWithText justify Icon={Comment} className="molecule_view-stats">
					<IconLabel>{numberFormatter(comments)}</IconLabel>
				</IconWithText>
			</ContainerLink>
		}
	</FlexBox>
);

export default ViewStats;
