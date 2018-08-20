import React, { Component } from 'react';
import { omit } from 'lodash';
import { browserHistory } from 'react-router';
import {
	Step,
	Stepper,
	StepLabel,
} from 'material-ui/Stepper';

import QuizText from './QuizText';
import StepIcon from './StepIcon';

class SlayLessonContent extends Component {
	constructor(props) {
		super(props);
		this.state = {
			currentStep: +props.pageNumber - 1,
		};
	}

	handleStepClick = (e) => {
		const {
			quizId,
			itemType,
		} = this.props;
		const currentStep = +e.currentTarget.getAttribute('value');
		browserHistory.push(`/learn/lesson/${itemType === 3 ? 'course-lesson' : 'user-lesson'}/${quizId}/${currentStep + 1}`);
		this.setState({ currentStep });
	}

	render() {
		const { parts } = this.props;
		const { currentStep } = this.state;
		return parts ?
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
					{...omit(this.props, 'textContent')}
					textContent={parts[currentStep].textContent}
				/>

			</div>
			:
			<QuizText {...this.props} />;
	}
}

export default SlayLessonContent;
