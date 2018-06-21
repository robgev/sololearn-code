import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Checkbox, Paper, Divider, RaisedButton } from 'material-ui';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import { shuffleArray } from 'utils';
import { quizType } from './types';

import TopBar from './TopBar';

// Pure utility functions
const isSingleAnswer = answers =>
	answers.reduce((acc, curr) => (curr.isCorrect ? acc + 1 : acc), 0) === 1;

const selectOne = (answers, id) => answers.map(a => ({ ...a, isSelected: a.id === id }));

const toggleSelected = (answers, id) => {
	const res = answers.map(a => (a.id === id ? { ...a, isSelected: !a.isSelected } : a));
	console.log(res);
	return res;
};

const SelectButton = ({ isRadio, ...props }) => (isRadio
	? <Checkbox
		checkedIcon={<RadioButtonChecked />}
		uncheckedIcon={<RadioButtonUnchecked />}
		{...props}
	/>
	: <Checkbox {...props} />);

const getShuffledAnswers = answers => shuffleArray(answers).map(a => ({ ...a, isSelected: false }));

class MultipleChoice extends Component {
	state = {
		shuffled: getShuffledAnswers(this.props.quiz.answers),
	}
	isSingleAnswer = isSingleAnswer(this.props.quiz.answers);
	toggleAnswer = (answerId) => {
		this.setState(state => ({
			shuffled: this.isSingleAnswer
				? selectOne(state.shuffled, answerId)
				: toggleSelected(state.shuffled, answerId),
		}));
	}
	unlock = () => {
		this.setState(state =>
			({ shuffled: state.shuffled.map(a => ({ ...a, isSelected: a.isCorrect })) }));
	}
	check = () => !this.state.shuffled.some(a => a.isCorrect !== a.isSelected);
	render() {
		const { shuffled } = this.state;
		const isRadio = this.isSingleAnswer;
		return (
			<div className="quiz">
				{this.props.unlockable && <TopBar onUnlock={this.unlock} />}
				<Paper className="question-container">
					<p className="question-text">{this.props.quiz.question}</p>
					<List>
						{
							shuffled.map((answer, index) => (
								<div key={answer.id}>
									{index === 0 && <Divider />}
									<ListItem
										leftCheckbox={
											<SelectButton
												onCheck={() => this.toggleAnswer(answer.id)}
												isRadio={isRadio}
												checked={answer.isSelected}
											/>}
									>
										{answer.text}
									</ListItem>
									{index !== shuffled.length - 1 && <Divider />}
								</div>
							))
						}
					</List>
				</Paper>
				<RaisedButton
					fullWidth
					secondary
					onClick={this.check}
					label="Check"
				/>
			</div>
		);
	}
}

MultipleChoice.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
};

export default MultipleChoice;
