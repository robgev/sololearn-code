import React, { Component, Fragment } from 'react';
import { browserHistory } from 'react-router';
import { FlexBox, MenuItem,	Step, Stepper } from 'components/atoms';
import { IconMenu } from 'components/molecules';
import { MoreVert } from 'components/icons';
import ReportItemTypes from 'constants/ReportItemTypes';
import ReportPopup from 'components/ReportPopup';
import { toSeoFriendly } from 'utils';
import './styles.scss';

import QuizText from '../QuizText';

class SlayLessonContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			isReportPopupOpen: false,
		};
	}

	toggleReportPopup = () => {
		this.setState(state => ({ isReportPopupOpen: !state.isReportPopupOpen }));
	}

	render() {
		const {
 t, parts, lessonId, handleStepClick
} = this.props;
		const { isReportPopupOpen } = this.state;
		const { textContent, pageNumber, ...childProps } = this.props;
		const currentStep = Number(pageNumber || 1) - 1;
		return (
			<Fragment>
				<FlexBox className="slay_lesson-step-container" fullWidth justify align>
					{
						parts && parts.length > 1 &&
						<Stepper
							width={`${((parts.length * 3) + ((parts.length - 1) * 5))}%`}
							className="slay-lesson-stepper slay-lesson-align-left"
						>
							{parts.map((singlePart, index) => (
								<Step
									text={index + 1}
									key={singlePart.id}
									active={currentStep === index}
									completed={currentStep > index}
									onClick={() => handleStepClick(index)}
								/>
							))}
						</Stepper>
					}
					<IconMenu iconProps={{ className: 'slay-lesson-align-left' }} icon={MoreVert}>
						<MenuItem onClick={this.toggleReportPopup}>
							{t('common.report-action-title')}
						</MenuItem>
					</IconMenu>
				</FlexBox>
				<QuizText
					key={parts ? parts[currentStep].id : lessonId}
					{...childProps}
					textContent={parts ? parts[currentStep].textContent : textContent}
				/>

				<ReportPopup
					itemId={lessonId}
					open={isReportPopupOpen}
					itemType={ReportItemTypes.lesson}
					onClose={this.toggleReportPopup}
				/>
			</Fragment>
		);
	}
}

export default SlayLessonContent;
