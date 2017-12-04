// React modules
import React, { Component } from 'react';

// Additional components
import MultipleChoice from './QuizContainers/MultipleChoice';
import TypeIn from './QuizContainers/TypeIn';
import PlaceholderTypeIn from './QuizContainers/PlaceholderTypeIn';
import PlaceholderDragAndDrop from './QuizContainers/PlaceholderDragAndDrop';
import Reorder from './QuizContainers/Reorder';

export const QuizType = {
	MultipleChoice: 1,
	TypeIn: 2,
	PlaceholderTypeIn: 3,
	PlaceholderDragAndDrop: 6,
	Reorder: 8,
};

// MultipleChoice: 4, // StrikeOut

export const QuizComponents = {
	1: MultipleChoice,
	2: TypeIn,
	3: PlaceholderTypeIn,
	6: PlaceholderDragAndDrop,
	8: Reorder,
};

export default class QuizSelector extends Component {
	render() {
		const QuizComponent = QuizComponents[this.props.quiz.type];
		const key = this.props.quiz.id + (this.props.retryIndex ? this.props.retryIndex : '');

		return (
			<QuizComponent
				key={key}
				quiz={this.props.quiz}
				ref={(child) => { this._quizSelectorChild = child; }}
			/>
		);
	}
}
