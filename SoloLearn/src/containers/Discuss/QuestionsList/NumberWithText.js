import React from 'react';
import { TextBlock, FlexBox, SecondaryTextBlock } from 'components/atoms';

const NumberWithText = ({ number, text }) => (
	<FlexBox column align justify className="number-with-text">
		<TextBlock>
			{number}
		</TextBlock>
		<SecondaryTextBlock>
			{text}
		</SecondaryTextBlock>
	</FlexBox>
);

export default NumberWithText;
