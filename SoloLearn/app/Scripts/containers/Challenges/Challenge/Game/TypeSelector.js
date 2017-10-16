//React modules
import React, { Component } from 'react';

//Additional components
import MultipleChoice from '../../../Learn/QuizContainers/MultipleChoice';
import TypeIn from '../../../Learn/QuizContainers/TypeIn';
import PlaceholderTypeIn from '../../../Learn/QuizContainers/PlaceholderTypeIn';
import PlaceholderDragAndDrop from '../../../Learn/QuizContainers/PlaceholderDragAndDrop';
import Reorder from '../../../Learn/QuizContainers/Reorder';
import Radium from 'radium';
import RaisedButton from 'material-ui/RaisedButton';
import { QuizComponents, QuizType } from '../../../Learn/QuizSelector';

const styles = {
    center: {
        height: '100%',
        display: 'flex',
        justifyContent: 'space-around',
        alignItems: 'center',
        flexDirection: 'column'
    },

    button: {
        marginTop: 10
    },

    quizQuestion: {
        textAlign: 'left',
        fontSize: 20,
        marginRight: 300,
        whiteSpace: 'pre'
    },
}

class TypeSelector extends Component {
    check = () => {
        const result = this._child.check() ? 2 : 3;
        this.props.showResult(result);
    }
    generateQuestion = (type, question) => {
        let questionText = '';
        if (type == QuizType.PlaceholderTypeIn || type == QuizType.PlaceholderDragAndDrop ||
            type == QuizType.PlaceholderImageDragAndDrop) {
            let formatterRegex = /\[!([a-zA-Z0-9]+)!\].*/gi;
            const match = formatterRegex.exec(question);
            if (match) {
                questionText = question.substring(0, match.index).trim();
            } else {
                questionText = question;
            }
        } else {
            questionText = question;
        }
        return questionText.replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/\r\n/g, '<br/>');
    }
    render() {
        const QuizComponent = QuizComponents[this.props.quiz.type];
        const { quiz } = this.props;
        return(
            <div>
                <div style={styles.center}>
                    <div dangerouslySetInnerHTML={{__html: this.generateQuestion(quiz.type, quiz.question) }} style={styles.quizQuestion}></div>
                    <QuizComponent
                        quiz={quiz}
                        ref={child => { this._child = child }}
                    />
                    <RaisedButton
                        secondary
                        label='Check'
                        onClick={this.check}
                        style={styles.button}
                    />
                </div>
            </div>
        ); 
    }
}

export default Radium(TypeSelector);