import React from 'react';
import { numberFormatter } from 'utils';

import { Views, Comment } from 'components/icons'; 
import { Container, SecondaryTextBlock } from 'components/atoms';
import 'styles/ViewStats.scss';

const ViewStats = ({
	color, views, comments, iconStyle,
}) => (
	<Container className="view-stats">
		{ views > 0 &&
			<Container className="stat-group">
				<Views className="stat-icon"/>
				<SecondaryTextBlock>{ numberFormatter(views) }</SecondaryTextBlock>
			</Container>
		}
		{ comments > 0 &&
			<Container className="stat-group">
				<Comment className="stat-icon"/>
				<SecondaryTextBlock>{ numberFormatter(comments) }</SecondaryTextBlock>
			</Container>
		}
	</Container>
);

export default ViewStats;
