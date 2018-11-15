import React, { Component, Fragment } from 'react';
import { browserHistory } from 'react-router';
import { FlexBox, MenuItem,	Step, Stepper } from 'components/atoms';
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
			currentStep: Number(props.pageNumber || 1) - 1,
		};
	}

	toggleReportPopup = () => {
		this.setState(state => ({ isReportPopupOpen: !state.isReportPopupOpen }));
	}

	handleStepClick = (currentStep) => {
		const {
			name,
			itemType,
			activeLesson,
		} = this.props;
		browserHistory.push(`/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${activeLesson.id}/${toSeoFriendly(name, 100)}/${currentStep + 1}`);
		this.setState({ currentStep });
	}

	render() {
		const { t, parts, lessonId } = this.props;
		const { currentStep, isReportPopupOpen } = this.state;
		const { textContent, ...childProps } = this.props;
		return (
			<Fragment>
				<FlexBox justify align>
					{
						parts &&
						<Stepper className="slay-lesson-stepper">
							{parts.map((singlePart, index) => (
								<Step
									text={index + 1}
									key={singlePart.id}
									active={currentStep === index}
									completed={currentStep > index}
									onClick={() => this.handleStepClick(index)}
								/>
							))}
						</Stepper>
					}
					<IconMenu icon={MoreVert}>
						<MenuItem onClick={this.toggleReportPopup}>
							{t('common.report-action-title')}
						</MenuItem>
					</IconMenu>
				</FlexBox>
				<QuizText
					key={parts[currentStep].id}
					{...childProps}
					textContent={parts ? parts[currentStep].textContent : textContent}
				/>

				<ReportPopup
					itemId={lessonId}
					open={isReportPopupOpen}
					itemType={ReportItemTypes.lesson}
					onRequestClose={this.toggleReportPopup}
				/>
			</Fragment>
		);
	}
}

export default SlayLessonContent;
