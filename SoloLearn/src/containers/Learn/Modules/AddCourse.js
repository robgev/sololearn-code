import React from 'react';
import { translate } from 'react-i18next';
import { Container, TextBlock, SecondaryTextBlock } from 'components/atoms';
import { RaisedButton } from 'components/molecules';

const AddCourse = ({ t, onOpen }) => (
	<Container className="no-courses">
		<SecondaryTextBlock className="title">{t('learn.add-courses-title')}</SecondaryTextBlock>
		<TextBlock className="sub-title">{t('learn.add-courses-message')}</TextBlock>
		<RaisedButton
			onClick={onOpen}
			color="secondary"
			className="add-button"
		>
			{t('learn.add-courses-button-title')}
		</RaisedButton>
	</Container>
);

export default translate()(AddCourse);
