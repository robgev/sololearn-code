import React from 'react';
import { FlexBox, TextBlock } from 'components/atoms';
import { numberFormatter } from 'utils';

const SectionStats = ({ name, stat }) => (
	<FlexBox className="section-stats" column>
		<TextBlock className="name">
			{name}
		</TextBlock>
		<TextBlock className="stat">
			{numberFormatter(stat)}
		</TextBlock>
	</FlexBox>
);

export default SectionStats;
