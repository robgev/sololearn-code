import React, { Component } from 'react';
import PropTypes from 'prop-types';
import Chip from 'material-ui/Chip';
import { shuffleArray } from 'utils';
import quizType from './types';

// Pure utils
const formatAnswers = (answerText, selected, width, disabled, onClick) => {
	const regex = /\{(\d)}/;
	return answerText
		.split(regex).reduce((acc, curr, index) => (acc.isMark
			? ({
				result: [ ...acc.result,
				// eslint-disable-next-line react/no-array-index-key
					<div key={index} style={{ display: 'inline-block' }}>
						<div
							onClick={() => onClick(selected[curr].id)}
							className="placeholder-dnd-item"
							role="button"
							tabIndex={0}
							style={{
								width: `${width}em`,
								color: disabled ? 'gray' : 'black',
							}}
						>{selected[curr] !== null ? selected[curr].text : ''}
						</div>
					</div>,
				],
				isMark: false,
			})
			: ({
				// eslint-disable-next-line react/no-array-index-key
				result: [ ...acc.result, <span style={{ whiteSpace: 'pre-wrap' }} key={index}>{curr}</span> ], isMark: true,
			})), { result: [], isMark: false }).result;
};

const getNotNulls = arr => arr.filter(a => a !== null);

const isSelected = (selected, id) => getNotNulls(selected).some(s => s.id === id);

class PlaceholderDnD extends Component {
	constructor(props) {
		super(props);
		[ this.question, this.answerText ] = props.quiz.question.split(/\[!\w+!]/);
		this.correctAnswers = props.quiz.answers.filter(a => a.isCorrect);
		this.longestAnswer = this.correctAnswers // get max length to make all placeholders equal
			.reduce((l, { text: { length } }) => Math.max(l, length), 0);
		this.state = {
			shuffled: shuffleArray(props.quiz.answers),
			selected: new Array(this.correctAnswers.length).fill(null),
		};
	}
	onClick = (id) => {
		if (isSelected(this.state.selected, id)) {
			this._deselect(id);
		} else {
			this._select(id);
		}
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
			<div className="question-container">
				<p className="question-text">{this.question}</p>
				<div className="fill-in-answers-container">
					{formatAnswers(this.answerText, selected, this.longestAnswer, disabled, this.onClick)}
				</div>
				<div style={{ display: 'flex' }}>
					{shuffled.map(answer => (
						<Chip
							key={answer.id}
							onClick={() => this.onClick(answer.id)}
							labelColor={isSelected(selected, answer.id) ? '#8BC34A' : 'black'}
							style={{
								margin: 5,
								cursor: 'pointer',
							}}
						>{answer.text}
						</Chip>
					))}
				</div>
			</div >
		);
	}
}

PlaceholderDnD.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default PlaceholderDnD;
