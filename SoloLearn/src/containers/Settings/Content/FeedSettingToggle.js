import React from 'react';
import texts from 'texts';

import {
	Container,
	SwitchToggle,
	SecondaryTextBlock,
} from 'components/atoms';

const FeedSettingToggle = ({
	name,
	onToggle,
	isSettingOn,
}) => (
	<Container className="content-card-container">
		<SecondaryTextBlock>{texts.feedItemNames[name]}</SecondaryTextBlock>
		<SwitchToggle
			name={name}
			onChange={onToggle}
			checked={isSettingOn}
		/>
	</Container>
);

export default FeedSettingToggle;
