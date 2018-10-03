import React, { Component, Fragment } from 'react';
import { translate } from 'react-i18next';
import { List } from 'material-ui/List';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import InfiniteScroll from 'react-infinite-scroller';
import LanguageCard from 'components/LanguageCard';
import ChallengeItem from './ChallengeItem';

@translate(null, { withRef: true })
class ChallengesList extends Component {
	challengeRefs = {};
	scrollToID = (id) => {
		if (id !== null && this.challengeRefs[id]) {
			this.challengeRefs[id].getWrappedInstance().scrollIntoView();
		}
	}
	render() {
		const {
			challenges, preview, courses, loadMore, hasMore, t, isFetching,
		} = this.props;
		return (
			!isFetching && challenges.length === 0
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
					<Fragment>
						<Paper>
							<InfiniteScroll
								loadMore={loadMore}
								loader={null}
								hasMore={hasMore}
								style={{
									display: 'flex',
									width: '100%',
									flexDirection: 'column',
								}}
								initialLoad={false}
							>
								<List style={{ padding: 0 }}>
									{challenges.map(quiz => (
										<ChallengeItem
											key={quiz.id}
											ref={(node) => { this.challengeRefs[quiz.id] = node; }}
											quiz={quiz}
											preview={preview}
											leftIcon={
												<LanguageCard
													language={courses.find(c => c.id === quiz.courseID).language}
												/>
											}
										/>
									))}
								</List>
							</InfiniteScroll>
						</Paper>
						{isFetching &&
							<CircularProgress
								style={{
									display: 'flex', alignItems: 'center', margin: '10px auto',
								}}
							/>}
					</Fragment>
				)
		);
	}
}

export default ChallengesList;
