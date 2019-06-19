import React from 'react';
import { numberFormatter } from 'utils';
import { Arrows, Views, Comment } from 'components/icons';
import { IconWithText, ContainerLink } from 'components/molecules';
import { FlexBox, IconLabel } from 'components/atoms';

import './styles.scss';

const ViewStats = ({
	views, votes, comments, link, className,
}) => (
	<FlexBox align className={className}>
		{Number.isInteger(votes) && // Can have negative votes
			<IconWithText justify isIconComponent={false} Icon="/assets/ic_like_dislike.png" className="molecule_view-stats">
				<IconLabel>{votes > 0 ? `+${numberFormatter(votes)}` : numberFormatter(votes)}</IconLabel>
			</IconWithText>
		}
		{comments >= 0 &&
			<ContainerLink to={link}>
				<IconWithText justify Icon={Comment} className="molecule_view-stats">
					<IconLabel>{numberFormatter(comments)}</IconLabel>
				</IconWithText>
			</ContainerLink>
		}
		{views >= 0 &&
			<IconWithText justify Icon={Views} className="molecule_view-stats">
				<IconLabel>{numberFormatter(views)}</IconLabel>
			</IconWithText>
		}
	</FlexBox>
);

export default ViewStats;
