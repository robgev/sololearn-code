import React from 'react';
import {
	FlexBox,
	Image,
	TextBlock,
} from 'components/atoms';

import './styles.scss';

const Achievement = ({
	isLevelUp, user, title, measure,
}) => (
	<FlexBox
		align
		justify
		column
		className="feed-item_achievement"
	>
		<FlexBox align justify>
			<Image
				className="levelup-img"
				src={isLevelUp ? '/assets/ic_reached_level.png' : '/assets/ic_join_sololearn.png'}
				onLoad={measure}
			/>
		</FlexBox>
		<FlexBox align justify>
			<TextBlock className="levelup-title">
				{user.name} {title}
			</TextBlock>
		</FlexBox>
	</FlexBox>
);

export default Achievement;
