//React modules
import React, { Component } from 'react';

//Additional components
import MultipleChoice from './QuizContainers/MultipleChoice';
import TypeIn from './QuizContainers/TypeIn';
import PlaceholderTypeIn from './QuizContainers/PlaceholderTypeIn';
import PlaceholderDragAndDrop from './QuizContainers/PlaceholderDragAndDrop';
import Reorder from './QuizContainers/Reorder';

export const QuizType = {
    MultipleChoice: 1,
    TypeIn: 2,
    PlaceholderTypeIn: 3, 
    MultipleChoice: 4, //StrikeOut
    PlaceholderDragAndDrop: 6,
    Reorder: 8
};

const QuizComponents = {
    1: MultipleChoice,
    2: TypeIn,
    3: PlaceholderTypeIn,
    4: MultipleChoice, //StrikeOut
    6: PlaceholderDragAndDrop,
    8: Reorder
};

export default class QuizSelector extends Component {
    render() {
        const QuizComponent = QuizComponents[this.props.quiz.type];
        const key = this.props.quiz.id + (this.props.retryIndex ?  this.props.retryIndex : '');
        // ref={(child) => this._quizSelectorChild = child }

        return(
            <QuizComponent
                key={key}
                quiz={this.props.quiz}
            />
        ); 
    }
}