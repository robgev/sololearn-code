import React, { Component } from 'react';
import { DragDropContextProvider } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import PropTypes from 'prop-types';
import { shuffleArray } from 'utils';
import Answers from './Answers';
import DraggableChip from './DraggableChip';
import quizType from '../types';

const getNotNulls = arr => arr.filter(a => a !== null);

const isSelected = (selected, id) => getNotNulls(selected).some(s => s.id === id);

class PlaceholderDnD extends Component {
	constructor(props) {
		super(props);
		[this.question, this.answerText] = props.quiz.question.split(/\[!\w+!]/);
		this.correctAnswers = props.quiz.answers.filter(a => a.isCorrect);
		this.longestAnswer = this.correctAnswers // get max length to make all placeholders equal
			.reduce((l, { text: { length } }) => Math.max(l, length), 0) * 0.75;
		this.state = {
			shuffled: shuffleArray(props.quiz.answers),
			selected: new Array(this.correctAnswers.length).fill(null),
		};
	}
	onClick = (id) => {
		if (!this.props.disabled) {
			if (isSelected(this.state.selected, id)) {
				this._deselect(id);
			} else {
				this._select(id);
			}
		}
	}
	moveTo = (id, index) => {
		this.setState((state, props) => {
			const { selected } = state;
			selected[index] = props.quiz.answers.find(a => a.id === id);
			this.props.onChange({ isComplete: this.isComplete(selected) });
			return { selected };
		});
	}
	_select = (id) => {
		const { selected } = this.state;
		if (!this.isComplete(selected) && !getNotNulls(selected).some(a => a.id === id)) {
			for (let i = 0; i < selected.length; i += 1) {
				if (selected[i] === null) {
					selected[i] = this.props.quiz.answers.find(a => a.id === id);
					break;
				}
			}
			this.setState({ selected });
			this.props.onChange({ isComplete: this.isComplete(selected) });
		}
	}
	_deselect = (id) => {
		const selected = this.state.selected.map(a => (a !== null && a.id === id ? null : a));
		this.setState({ selected });
		this.props.onChange(selected);
	}

	isComplete = selected => !selected.includes(null)
	tryAgain = () => {
		this.setState({
			shuffled: shuffleArray(this.props.quiz.answers),
			selected: new Array(this.correctAnswers.length).fill(null),
		});
	}
	check = () => {
		const { selected } = this.state;
		for (let i = 0; i < selected.length; i += 1) {
			// no need to guard against null selected[i], as quiz is complete
			if (selected[i].id !== this.correctAnswers[i].id) {
				return false;
			}
		}
		return true;
	}
	unlock = () => {
		this.setState({ selected: this.correctAnswers });
	}
	render() {
		const { disabled } = this.props;
		const { selected, shuffled } = this.state;
		return (
			<DragDropContextProvider backend={HTML5Backend}>
				<div className="question-container">
					<p className="question-text">{this.question}</p>
					<div className="fill-in-answers-container">
						<Answers
							answerText={this.answerText}
							selected={selected}
							width={this.longestAnswer}
							isDisabled={disabled}
							onClick={this.onClick}
							correctAnswers={this.correctAnswers}
						/>
					</div>
					<div style={{ display: 'flex' }}>
						{shuffled.map(answer => (
							<DraggableChip
								answer={answer}
								key={answer.id}
								isSelected={isSelected(selected, answer.id)}
								isDisabled={isSelected(selected, answer.id) || disabled}
								onDrop={this.moveTo}
								onClick={this.onClick}
								style={{
									margin: 5,
									cursor: 'pointer',
								}}
							/>
						))}
					</div>
				</div>
			</DragDropContextProvider>
		);
	}
}

PlaceholderDnD.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default PlaceholderDnD;
