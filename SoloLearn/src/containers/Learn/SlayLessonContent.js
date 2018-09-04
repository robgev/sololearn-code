import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import ReportItemTypes from 'constants/ReportItemTypes';
import ReportPopup from 'components/ReportPopup';

import QuizText from './QuizText';
import StepIcon from './StepIcon';

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
		browserHistory.push(`/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${quizId}/${name}/${currentStep + 1}`);
		this.setState({ currentStep });
	}

	render() {
		const { t, parts, lessonId } = this.props;
		const { currentStep, isReportPopupOpen } = this.state;
		const { textContent, ...childProps } = this.props;
		return (
			<div style={{ position: 'relative' }}>
				{
					parts ?
						<div>
							<Stepper>
								{parts.map((singlePart, index) => (
									<Step
										value={index}
										key={singlePart.id}
										onClick={this.handleStepClick}
									>
										<StepLabel
											icon={
												<StepIcon
													text={index + 1}
													active={currentStep === index}
													completed={currentStep > index}
												/>
											}
											style={{
												paddingLeft: index === 0 ? 0 : 14,
												paddingRight: index === parts.length - 1 ? 0 : 14,
											}}
										/>
									</Step>
								))}
							</Stepper>
							<QuizText
								key={parts[currentStep].id}
								{...childProps}
								textContent={parts[currentStep].textContent}
							/>

						</div>
						:
						<QuizText {...this.props} />
				}
				<IconMenu
					iconButtonElement={
						<IconButton
							style={{
								height: 32,
								padding: 0,
							}}
						>
							<MoreVertIcon />
						</IconButton>
					}
					style={{ position: 'absolute', top: 0, right: 0 }}
					anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
					targetOrigin={{ horizontal: 'right', vertical: 'top' }}
				>
					<MenuItem
						primaryText={t('common.report-action-title')}
						onClick={this.toggleReportPopup}
					/>
				</IconMenu>
				<ReportPopup
					itemId={lessonId}
					open={isReportPopupOpen}
					itemType={ReportItemTypes.lesson}
					onRequestClose={this.toggleReportPopup}
				/>
			</div>
		);
	}
}

export default SlayLessonContent;
