import React from 'react';
import Paper from 'material-ui/Paper';
import Localize from 'components/Localize';

const QuestionInput = ({ question, onChange }) => (
	<Localize>
		{({ t }) => (
			<Paper className="question container">
				<span className="title">{t('factory.quiz-question-title')}</span>
				<textarea value={question} onChange={onChange} placeholder={t('factory.quiz-question-placeholder')} />
			</Paper>
		)}
	</Localize>
);

export default QuestionInput;
