import React, { Fragment } from 'react';
import { numberFormatter } from 'utils';
import { Views, Comment } from 'components/icons';
import { Container, SecondaryTextBlock } from 'components/atoms';

import './styles.scss';

const ViewStats = ({	views, comments }) => (
	<Fragment>
		{ views > 0 &&
			<Container className="molecule_view-stats">
				<Views className="molecule_view-stats-icon" />
				<SecondaryTextBlock>{ numberFormatter(views) }</SecondaryTextBlock>
			</Container>
		}
		{ comments > 0 &&
			<Container className="molecule_view-stats">
				<Comment className="molecule_view-stats-icon" />
				<SecondaryTextBlock>{ numberFormatter(comments) }</SecondaryTextBlock>
			</Container>
		}
	</Fragment>
);

export default ViewStats;
