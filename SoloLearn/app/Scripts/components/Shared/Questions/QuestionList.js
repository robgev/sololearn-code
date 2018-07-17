import React from 'react';
import InfiniteScroll from 'components/Shared/InfiniteScroll';
import Paper from 'material-ui/Paper';
import BusyWrapper from 'components/Shared/BusyWrapper';
import DiscussShimmer from 'components/Shared/Shimmers/DiscussShimmer';
import 'styles/Discuss/Questions.scss';
import QuestionItem from './QuestionItem';

export default ({ questions, loadMore, hasMore }) =>
	(questions !== null && questions.length === 0 ? <div>No questions found</div> : (
		<BusyWrapper
			isBusy={questions === null}
			className="discuss-busy-container"
			wrapperClassName="discuss-wrapper"
			loadingComponent={<Paper><DiscussShimmer /></Paper>}
		>
			<InfiniteScroll
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
		</BusyWrapper >
	));
