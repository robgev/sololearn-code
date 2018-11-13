// React modules
import React, { Fragment } from 'react';
import {
	Container,
	Image,
	SecondaryTextBlock
} from 'components/atoms';
import BottomToolbar from '../FeedBottomToolbar';

const Badge = ({ date, achievement }) => (
	<Fragment>
		<Container className="achievement">
			<Container
				className="badge-base"
				style={{ backgroundColor: achievement.color }}
			>
				<Image alt="achievement" src="/assets/achievement.png" classNmame="badge-icon" />
			</Container>
			<Container className="details" >
				<SecondaryTextBlock className="title">{achievement.title}</SecondaryTextBlock>
				<SecondaryTextBlock className="description">{achievement.description}</SecondaryTextBlock>
			</Container>
		</Container>
		<BottomToolbar date={date} />
	</Fragment>
);

export default Badge;
