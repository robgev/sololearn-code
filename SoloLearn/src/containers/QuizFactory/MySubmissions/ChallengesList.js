import React from 'react';
import { translate } from 'react-i18next';
import { List, ListItem } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';
import BusyWrapper from 'components/BusyWrapper';
import LanguageCard from 'components/LanguageCard';

// Utils

const getTypeString = (type) => {
	switch (type) {
	case 1:
		return 'factory.quiz-type-multiple-choice';
	case 2:
		return 'factory.quiz-type-guess-the-output';
	case 3:
		return 'factory.quiz-type-fill-in-the-blanks';
	default:
		throw new Error('Can\'t identify type of submitted challenge');
	}
};

const getStatus = (status) => {
	switch (status) {
	case 1:
		return { text: 'factory.submission-pending', color: '#BDBDBD' };
	case 2:
		return { text: 'factory.submission-declined', color: '#D32F2F' };
	case 3:
		return { text: 'factory.submission-approved', color: '#9CCC65' };
	default:
		throw new Error('Can\'t identify status of submitted challenge');
	}
};

const getQuestionTitle = (question) => {
	const indexOfFormat = question.indexOf(question.match(/\[!\w+!]/));
	if (indexOfFormat === -1) {
		return question;
	}
	return question.substring(0, indexOfFormat);
};

const ChallengesList = ({
	challenges, preview, courses, loadMore, hasMore, t,
}) => (
	challenges !== null && challenges.length === 0
		? (
			<div
				style={{
					height: 300,
					display: 'flex',
					justifyContent: 'center',
					alignItems: 'center',
				}}
			>
				{t('common.empty-list-message')}
			</div>
		)
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
					initialLoad={false}
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
										{t(getStatus(quiz.status).text)}
									</div>
								}
								primaryText={
									<div className="primary-text">
										{getQuestionTitle(quiz.question)}
									</div>
								}
								key={quiz.id}
								secondaryText={t(getTypeString(quiz.type))}
							/>
						))}
					</List>
				</InfiniteScroll>
			</BusyWrapper>
		)
);

export default translate()(ChallengesList);
