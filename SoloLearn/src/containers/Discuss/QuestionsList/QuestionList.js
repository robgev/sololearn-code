import React from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { List, TextBlock, FlexBox } from 'components/atoms';
import Question from './Question';

const QuestionList = ({ questions, t, isLoading }) => (
	questions.length > 0 || isLoading
		? (
			<List>
				{
					questions.map(question => (
						<Question key={question.id} question={question} />
					))
				}
			</List>
		)
		: (
			<FlexBox justify align className="empty-card-placeholder">
				<TextBlock>{t('common.empty-list-message')}</TextBlock>
			</FlexBox>
		)
);

export default translate()(observer(QuestionList));
