import React, { Fragment } from 'react';
import { Heading, SecondaryTextBlock, FlexBox } from 'components/atoms';

const DiscussSidebar = () => (
	<Fragment>
		<Heading>Guidelines</Heading>
		<FlexBox column>
			<SecondaryTextBlock>
				- Post only programming-related QUESTIONS and ANSWERS;
			</SecondaryTextBlock>
			<SecondaryTextBlock>
				- SEARCH for similar QUESTIONS or ANSWERS before posting;
			</SecondaryTextBlock>
			<SecondaryTextBlock>
				- Include relevant TAGS;
			</SecondaryTextBlock>
			<SecondaryTextBlock>
				- Follow community RULES: https://www.sololearn.com/Content-Creation-Guidelines/
			</SecondaryTextBlock>
			<SecondaryTextBlock>
				DO NOT
				- Post spam/advertisement;
				- Use inappropriate language.
			</SecondaryTextBlock>
		</FlexBox>
	</Fragment>
);

export default DiscussSidebar;
