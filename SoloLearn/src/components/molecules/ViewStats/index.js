import React from 'react';
import { numberFormatter } from 'utils';
import { Views, Comment, LikeDislike, ViewsSmall, CommentSmall, LikeDislikeSmall } from 'components/icons';
import { IconWithText, ContainerLink } from 'components/molecules';
import { FlexBox, IconLabel } from 'components/atoms';

import './styles.scss';

const ViewStats = ({
	views, votes, comments, link, className, small,
}) => (
	<FlexBox align className={className}>
		{Number.isInteger(votes) && // Can have negative votes
			<IconWithText justify Icon={small ? LikeDislikeSmall : LikeDislike} className="molecule_view-stats">
				<IconLabel className={small ? 'small' : ''}>{votes > 0 ? `+${numberFormatter(votes)}` : numberFormatter(votes)}</IconLabel>
			</IconWithText>
		}
		{comments && comments >= 0 &&
			<ContainerLink to={link}>
				<IconWithText justify Icon={small ? CommentSmall : Comment} className="molecule_view-stats">
					<IconLabel className={small ? 'small' : ''}>{numberFormatter(comments)}</IconLabel>
				</IconWithText>
			</ContainerLink>
		}
		{views && views >= 0 &&
			<IconWithText justify Icon={small ? ViewsSmall : Views} className="molecule_view-stats">
				<IconLabel className={small ? 'small' : ''}>{numberFormatter(views)}</IconLabel>
			</IconWithText>
		}
	</FlexBox>
);

export default ViewStats;
