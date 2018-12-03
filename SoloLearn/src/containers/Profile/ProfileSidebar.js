import React from 'react';
import { translate } from 'react-i18next';
import { Container, FlexBox, Heading, TextBlock } from 'components/atoms';

const ProfileSidebar = ({ t }) => (
	<Container>
		<Heading>Highlights</Heading>
		<FlexBox column align>
			<TextBlock>{t('skills.coming-soon')}</TextBlock>
		</FlexBox>
	</Container>
);

export default translate()(ProfileSidebar);
