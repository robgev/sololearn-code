import React from 'react';
import { numberFormatter } from 'utils';
import { Views, Comment } from 'components/icons';
import { FlexBox, SecondaryTextBlock } from 'components/atoms';

import './styles.scss';

const ViewStats = ({	views, comments }) => (
	<FlexBox align justify>
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
