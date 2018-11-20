import React from 'react';
import { translate } from 'react-i18next';
import { PaperContainer, Title, TextBox, FlexBox } from 'components/atoms';

const QuestionInput = ({ t, question, onChange }) => (
	<PaperContainer className="container">
		<FlexBox column className="question">
			<Title className="title">{t('factory.quiz-question-title')}</Title>
			<TextBox
				className="text"
				value={question}
				onChange={onChange}
				placeholder={t('factory.quiz-question-placeholder')}
			/>
		</FlexBox>
	</PaperContainer>
);

export default translate()(QuestionInput);
