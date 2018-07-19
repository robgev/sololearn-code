import React from 'react';
import InfiniteScroll from 'components/InfiniteScroll';
import Paper from 'material-ui/Paper';
// import BusyWrapper from 'components/BusyWrapper'; TODO: Put component in BusyWrapper
import DiscussShimmer from 'components/Shimmers/DiscussShimmer';
import 'styles/Discuss/Questions.scss';
import QuestionItem from './QuestionItem';

export default ({
	questions, loadMore, hasMore, header,
}) =>
	(questions !== null && questions.length === 0 ? <div>No questions found</div> : (
		<div>
			{questions === null &&
				(
					<Paper style={{ height: '100vh', overflow: 'hidden' }}>
						{header}
						<DiscussShimmer />
					</Paper>
				)}
			<InfiniteScroll
				header={header}
				loadMore={loadMore}
				hasMore={hasMore}
				style={{
					display: 'flex',
					width: '100%',
					flexDirection: 'column',
				}}
			>
				{questions !== null && questions.map(el => <QuestionItem key={el.id} question={el} />)}
			</InfiniteScroll>
		</div>
	));
