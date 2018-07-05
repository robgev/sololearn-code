import React from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import CircularProgress from 'material-ui/CircularProgress';
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
			loadingComponent={<DiscussShimmer />}
		>
			<InfiniteScroll
				loadMore={loadMore}
				hasMore={hasMore}
				style={{ display: 'flex', flexDirection: 'column', selfAlign: 'stretch' }}
				loader={<CircularProgress
					style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
					key="circular-progress"
					size={40}
				/>}
			>
				{questions !== null &&
					questions.map(el => <QuestionItem key={el.id} question={el} />)}
			</InfiniteScroll>
		</BusyWrapper >
	));
