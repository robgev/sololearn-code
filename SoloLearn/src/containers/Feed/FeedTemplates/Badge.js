// React modules
import React, { Fragment } from 'react';
import {
	Container,
	Image,
	Link,
	FlexBox,
	SecondaryTextBlock,
} from 'components/atoms';
import 'styles/Feed/FeedTemplates/Badge.scss';
import BottomToolbar from '../FeedBottomToolbar';

const Badge = ({ date, achievement, url }) => (
	<Fragment>
		<Container className="achievement">
			<Container
				className="badge-base"
				style={{ backgroundColor: achievement.color }}
			>
				<Image alt="achievement" src="/assets/achievement.png" className="badge-icon" />
			</Container>
			<FlexBox column className="details" >
				<Link to={url}><SecondaryTextBlock className="title">{achievement.title}</SecondaryTextBlock></Link>
				<SecondaryTextBlock className="description">{achievement.description}</SecondaryTextBlock>
			</FlexBox>
		</Container>
		<BottomToolbar date={date} />
	</Fragment>
);

export default Badge;
