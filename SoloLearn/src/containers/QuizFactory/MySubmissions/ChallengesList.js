import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { List, FlexBox, TextBlock } from 'components/atoms';
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
			challenges, preview, courses, isLoading, t,
		} = this.props;
		if (challenges.length === 0 && !isLoading) {
			return (
				<FlexBox justify align className="empty-card-placeholder">
					<TextBlock>{t('common.empty-list-message')}</TextBlock>
				</FlexBox>
			);
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
