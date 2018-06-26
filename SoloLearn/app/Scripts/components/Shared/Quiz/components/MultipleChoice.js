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
	tryAgain = () => {
		this.props.onTryAgain();
		this.setState({
			shuffled: getShuffledAnswers(this.props.quiz.answers),
			checkResult: null,
		});
	}
	toggleAnswer = (answerId) => {
		this.setState(state => ({
			shuffled: this.isSingleAnswer
				? selectOne(state.shuffled, answerId)
				: toggleSelected(state.shuffled, answerId),
		}));
	}
	unlock = () => {
		if (this.props.onUnlock) {
			this.setState(state =>
				({ shuffled: state.shuffled.map(a => ({ ...a, isSelected: a.isCorrect })) }));
			this.check();
		}
	}
	check = () => {
		this.setState(state => ({
			checkResult: !state.shuffled.some(a => a.isCorrect !== a.isSelected),
		}), () => {
			this.props.onCheck(this.state.checkResult);
		});
	}
	isComplete = () => this.state.shuffled.some(a => a.isSelected)
	render() {
		const { shuffled, checkResult } = this.state;
		const { canTryAgain } = this.props;
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
						onClick={isChecked ? this.tryAgain : this.check}
						disabled={!this.isComplete() || (isChecked && !canTryAgain)}
						label={isChecked && canTryAgain ? 'Try again' : 'Check'}
					/>
					<CheckIndicator status={checkResult} />
				</div>
			</div>
		);
	}
}

MultipleChoice.defaultProps = {
	onCheck: () => { },
	onUnlock: () => false,
};

MultipleChoice.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
	onCheck: PropTypes.func, // handles side effects after checking
	onUnlock: PropTypes.func, // returns true if can unlock and handles side effects,
	canTryAgain: PropTypes.bool.isRequired,
	onTryAgain: PropTypes.func.isRequired,
};

export default MultipleChoice;
