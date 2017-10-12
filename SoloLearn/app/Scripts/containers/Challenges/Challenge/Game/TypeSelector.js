//React modules
import React, { Component } from 'react';

//Additional components
import MultipleChoice from '../../../Learn/QuizContainers/MultipleChoice';
import TypeIn from '../../../Learn/QuizContainers/TypeIn';
import PlaceholderTypeIn from '../../../Learn/QuizContainers/PlaceholderTypeIn';
import PlaceholderDragAndDrop from '../../../Learn/QuizContainers/PlaceholderDragAndDrop';
import Reorder from '../../../Learn/QuizContainers/Reorder';

import RaisedButton from 'material-ui/RaisedButton';

const QuizComponents = {
    1: MultipleChoice,
    2: TypeIn,
    3: PlaceholderTypeIn,
    4: MultipleChoice, //StrikeOut
    6: PlaceholderDragAndDrop,
    8: Reorder
};

export default class TypeSelector extends Component {
    check = () => {
        const result = this._child.check() ? 2 : 3;
        this.props.showResult(result);
    }
    render() {
        const QuizComponent = QuizComponents[this.props.quiz.type];

        return(
            <div>
                <QuizComponent
                    quiz={this.props.quiz}
                    ref={child => { this._child = child }}
                />
                <RaisedButton
                    secondary
                    label='Next'
                    onClick={this.check}
                />
            </div>
        ); 
    }
}