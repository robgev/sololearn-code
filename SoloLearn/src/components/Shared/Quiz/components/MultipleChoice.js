import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import Divider from 'material-ui/Divider';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import { shuffleArray } from 'utils';
import quizType from './types';

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
	}
	isSingleAnswer = isSingleAnswer(this.props.quiz.answers);
	_toggleAnswer = (answerId) => {
		const shuffled = this.isSingleAnswer
			? selectOne(this.state.shuffled, answerId)
			: toggleSelected(this.state.shuffled, answerId);
		this.setState({ shuffled });
		this.props.onChange({ isComplete: this.isComplete(shuffled) });
	}
	isComplete = answers => answers.some(a => a.isSelected);
	tryAgain = () => {
		this.setState({
			shuffled: getShuffledAnswers(this.props.quiz.answers),
		});
	}
	unlock = () => {
		this.setState(state =>
			({ shuffled: state.shuffled.map(a => ({ ...a, isSelected: a.isCorrect })) }));
	}
	check = () => !this.state.shuffled.some(a => a.isCorrect !== a.isSelected)
	render() {
		const { shuffled } = this.state;
		const { disabled } = this.props;
		const isRadio = this.isSingleAnswer;
		return (
			<div className="question-container">
				<p className="question-text">{this.props.quiz.question}</p>
				<List style={{ padding: 0 }}>
					{
						shuffled.map((answer, index) => (
							<div key={answer.id}>
								{index === 0 && <Divider />}
								<ListItem
									leftCheckbox={
										<SelectButton
											onCheck={() => this._toggleAnswer(answer.id)}
											isRadio={isRadio}
											checked={answer.isSelected}
											disabled={disabled}
										/>}
								>
									{answer.text}
								</ListItem>
								{index !== shuffled.length - 1 && <Divider />}
							</div>
						))
					}
				</List>
			</div>
		);
	}
}

MultipleChoice.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default MultipleChoice;
