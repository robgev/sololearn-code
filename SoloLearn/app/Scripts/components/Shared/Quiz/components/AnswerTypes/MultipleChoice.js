import React, { Component } from 'react';
import { List, ListItem, Checkbox } from 'material-ui';
import RadioButtonChecked from 'material-ui/svg-icons/toggle/radio-button-checked';
import RadioButtonUnchecked from 'material-ui/svg-icons/toggle/radio-button-unchecked';
import { shuffleArray } from 'utils';
import answersType from './answersType';

// Pure utility functions
const isSingleAnswer = answers =>
	answers.reduce((acc, curr) => (acc + curr.isCorrect ? 1 : 0), 0) === 1;

const selectOne = (answers, id) => answers.map(a => ({ ...a, isSelected: a.id === id }));

const toggleSelected = (answers, id) =>
	answers.map(a => (a.id === id ? { ...a, isSelected: !a.isSelected } : a));

const SelectButton = ({ isRadio, ...props }) => (isRadio
	? <Checkbox checkedIcon={RadioButtonChecked} uncheckedIcon={RadioButtonUnchecked} {...props} />
	: <Checkbox {...props} />);

class MultipleChoice extends Component {
	state = {
		shuffled: this.getShuffled(this.props.answers),
	}
	isSingleAnswer = isSingleAnswer(this.props.answers);
	getShuffled = answers => shuffleArray(answers).map(a => ({ ...a, isSelected: false }))
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
			<List>
				{
					shuffled.map(answer => (
						<ListItem
							key={answer.id}
							onClick={() => this.toggleAnswer(answer.id)}
							leftCheckbox={
								<SelectButton
									isRadio={isRadio}
									checked={answer.isSelected}
								/>}
						>
							{answer.text}
						</ListItem>
					))
				}
			</List>
		);
	}
}

MultipleChoice.propTypes = {
	answers: answersType.isRequired,
};

export default MultipleChoice;
