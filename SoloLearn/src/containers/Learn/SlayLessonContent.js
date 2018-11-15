import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { Container, MenuItem,	Step, Stepper, StepIcon } from 'components/atoms';
import { IconMenu } from 'components/molecules';
import { MoreVert } from 'components/icons';
import ReportItemTypes from 'constants/ReportItemTypes';
import ReportPopup from 'components/ReportPopup';
import { toSeoFriendly } from 'utils';

import QuizText from './QuizText';

class SlayLessonContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStep: +props.pageNumber - 1,
		};
	}

	toggleReportPopup = () => {
		this.setState(state => ({ isReportPopupOpen: !state.isReportPopupOpen }));
	}

	handleStepClick = (e) => {
		const {
			name,
			quizId,
			itemType,
		} = this.props;
		const currentStep = +e.currentTarget.getAttribute('value');
		browserHistory.push(`/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${quizId}/${toSeoFriendly(name, 100)}/${currentStep + 1}`);
		this.setState({ currentStep });
	}

	render() {
		const { t, parts, lessonId } = this.props;
		const { currentStep, isReportPopupOpen } = this.state;
		const { textContent, ...childProps } = this.props;
		return (
			<Container style={{ position: 'relative' }}>
				{
					parts ?
						<Container>
							<Stepper>
								{parts.map((singlePart, index) => (
									<Step
										value={index}
										key={singlePart.id}
										onClick={this.handleStepClick}
									>
										<StepIcon />
									</Step>
								))}
							</Stepper>
							<QuizText
								key={parts[currentStep].id}
								{...childProps}
								textContent={parts[currentStep].textContent}
							/>
						</Container>
						:
						<QuizText {...this.props} />
				}
				<IconMenu icon={MoreVert}>
					<MenuItem onClick={this.toggleReportPopup}>
						{t('common.report-action-title')}
					</MenuItem>
				</IconMenu>
				<ReportPopup
					itemId={lessonId}
					open={isReportPopupOpen}
					itemType={ReportItemTypes.lesson}
					onRequestClose={this.toggleReportPopup}
				/>
			</Container>
		);
	}
}

export default SlayLessonContent;
