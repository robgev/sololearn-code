import React from 'react';
import { observer } from 'mobx-react';
import { List } from 'components/atoms';
import { EmptyCard } from 'components/molecules';
import Question from './Question';

const QuestionList = ({ questions, isLoading }) => (
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
		: <EmptyCard />
);

export default observer(QuestionList);
