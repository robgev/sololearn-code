import React from 'react';
import { observer } from 'mobx-react';
import { List } from 'components/atoms';
import { EmptyCard } from 'components/molecules';
import DiscussShimmer from 'components/Shimmers/DiscussShimmer';
import Question from './Question';

const QuestionList = ({ questions, hasMore }) => (
	questions.length > 0 || hasMore
		? (questions.length === 0
			? <DiscussShimmer />
			: (
				<List>
					{
						questions.map(question => (
							<Question key={question.id} question={question} />
						))
					}
				</List>
			)
		)
		: <EmptyCard />
);

export default observer(QuestionList);
