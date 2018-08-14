import React from 'react';
import { observer } from 'mobx-react';
import InfiniteScroll from 'components/InfiniteScroll';
import Paper from 'material-ui/Paper';
import DiscussShimmer from 'components/Shimmers/DiscussShimmer';
import 'styles/Discuss/Questions.scss';
import QuestionItem from './QuestionItem';

export default observer(({
	questions, loadMore, hasMore, header,
}) =>
	(questions.length === 0 && !hasMore ? <div>No questions found</div> : (
		<div>
			{questions.length === 0 &&
				(
					<Paper style={{ height: '100vh', padding: 15, overflow: 'hidden' }}>
						{header}
						<DiscussShimmer />
					</Paper>
				)}
			<InfiniteScroll
				header={questions.length !== 0 ? header : null}
				loadMore={loadMore}
				hasMore={hasMore}
				style={{
					display: 'flex',
					width: '100%',
					padding: 15,
					flexDirection: 'column',
				}}
			>
				{questions.map(el => <QuestionItem key={el.id} question={el} />)}
			</InfiniteScroll>
		</div>
	)));
