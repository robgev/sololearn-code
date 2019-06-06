import React, { Component } from 'react';
import { List, FlexBox, TextBlock, Title } from 'components/atoms';
import { EmptyCard, RaisedButton, ContainerLink } from 'components/molecules';
import LanguageCard from 'components/LanguageCard';
import ChallengeItem from './ChallengeItem';

class ChallengesList extends Component {
	challengeRefs = {};
	scrollToID = (id) => {
		if (id !== null && this.challengeRefs[id]) {
			this.challengeRefs[id].getWrappedInstance().scrollIntoView();
		}
	}
	render() {
		const {
			challenges, preview, courses, isLoading, shouldLinkToSuggest,
		} = this.props;
		if (shouldLinkToSuggest) {
			return (
				<FlexBox column align>
					<Title>No submissions</Title>
					<TextBlock>You have not submitted a quiz yet</TextBlock>
					<ContainerLink to={{ pathname: '/quiz-factory', state: { popupOpen: true } }}>
						<RaisedButton
							color="primary"
						>
							Create a quiz
						</RaisedButton>
					</ContainerLink>
				</FlexBox>
			);
		}
		if (challenges.length === 0 && !isLoading) {
			return <EmptyCard />;
		}
		return (
			<List className="challenges-list">
				{
					challenges.map(quiz => (
						<ChallengeItem
							key={quiz.id}
							ref={(node) => { this.challengeRefs[quiz.id] = node; }}
							quiz={quiz}
							preview={preview}
							languageCard={
								<LanguageCard
									language={courses.find(c => c.id === quiz.courseID).language}
								/>
							}
						/>
					))
				}
			</List>
		);
	}
}

export default ChallengesList;
