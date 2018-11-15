import React from 'react';
import { numberFormatter } from 'utils';
import { Arrows, Views, Comment } from 'components/icons';
import { FlexBox, SecondaryTextBlock } from 'components/atoms';

import './styles.scss';

const ViewStats = ({	views, votes, comments }) => (
	<FlexBox align justify>
		{ votes > 0 &&
			<FlexBox align justify className="molecule_view-stats">
				<Arrows className="molecule_view-stats-icon" />
				<SecondaryTextBlock>{votes > 0 ? `+${numberFormatter(votes)}` : numberFormatter(votes)}</SecondaryTextBlock>
			</FlexBox>
		}
		{ views > 0 &&
			<FlexBox align justify className="molecule_view-stats">
				<Views className="molecule_view-stats-icon" />
				<SecondaryTextBlock>{ numberFormatter(views) }</SecondaryTextBlock>
			</FlexBox>
		}
		{ comments > 0 &&
			<FlexBox align justify>
				<Comment className="molecule_view-stats-icon" />
				<SecondaryTextBlock>{ numberFormatter(comments) }</SecondaryTextBlock>
			</FlexBox>
		}
	</FlexBox>
);

export default ViewStats;
