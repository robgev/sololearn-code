import React from 'react';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import BusyWrapper from 'components/Shared/BusyWrapper';
import LanguageCard from 'components/Shared/LanguageCard';

// Utils

const getTypeString = (type) => {
	switch (type) {
	case 1:
		return 'Multiple Choice';
	case 2:
		return 'Guess the Output';
	case 3:
		return 'Fill in the Blank(s)';
	default:
		throw new Error('Can\'t identify type of submitted challenge');
	}
};

const getStatus = (status) => {
	switch (status) {
	case 1:
		return { text: 'Pending', color: '#BDBDBD' };
	case 2:
		return { text: 'Declined', color: '#D32F2F' };
	case 3:
		return { text: 'Approved', color: '#9CCC65' };
	default:
		throw new Error('Can\'t identify status of submitted challenge');
	}
};

export default ({
	challenges, preview, courses, loadMore, hasMore,
}) => (
	challenges !== null && challenges.length === 0
		? <div>No challenges found</div>
		: (
			<BusyWrapper
				paper
				isBusy={challenges === null}
				className="submissions-busy-container"
				wrapperClassName="submissions-wrapper"
				loadingComponent={
					<CircularProgress
						style={{
							display: 'flex',
							alignItems: 'center',
							margin: 'auto',
						}}
					/>
				}
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
					<List style={{ padding: 0 }}>
						{challenges !== null && challenges.map(quiz => (
							<ListItem
								onClick={() => preview(quiz)}
								className="preview"
								leftIcon={
									<LanguageCard
										language={courses.find(c => c.id === quiz.courseID).language}
									/>
								}
								rightIcon={
									<div
										className="status"
										style={{ height: 'initial', width: 80, backgroundColor: getStatus(quiz.status).color }}
									>
										{getStatus(quiz.status).text.toUpperCase()}
									</div>
								}
								primaryText={<div className="primary-text">{quiz.question.replace(/\[!\w+!]/, '')}</div>}
								key={quiz.id}
								secondaryText={getTypeString(quiz.type)}
							/>
						))}
					</List>
				</InfiniteScroll>
			</BusyWrapper>
		)
);
