import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem, Checkbox, Paper, Divider, RaisedButton } from 'material-ui';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import { shuffleArray } from 'utils';
import { quizType } from './types';

import TopBar from './TopBar';
import CheckIndicator from './CheckIndicator';

// Pure utility functions
const isSingleAnswer = answers =>
	answers.reduce((acc, curr) => (curr.isCorrect ? acc + 1 : acc), 0) === 1;

const selectOne = (answers, id) => answers.map(a => ({ ...a, isSelected: a.id === id }));

const toggleSelected = (answers, id) => {
	const res = answers.map(a => (a.id === id ? { ...a, isSelected: !a.isSelected } : a));
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
		checkResult: null,
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
		this.check();
	}
	check = () => {
		this.setState(state => ({
			checkResult: !state.shuffled.some(a => a.isCorrect !== a.isSelected),
		}));
	}
	render() {
		const { shuffled, checkResult } = this.state;
		const isChecked = checkResult !== null;
		const isRadio = this.isSingleAnswer;
		return (
			<div className="quiz">
				{this.props.unlockable && <TopBar disabled={isChecked} onUnlock={this.unlock} />}
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
												disabled={isChecked}
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
				<div className="check-container">
					<RaisedButton
						secondary
						onClick={this.check}
						label="Check"
					/>
					<CheckIndicator status={checkResult} />
				</div>
			</div>
		);
	}
}

MultipleChoice.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
};

export default MultipleChoice;
