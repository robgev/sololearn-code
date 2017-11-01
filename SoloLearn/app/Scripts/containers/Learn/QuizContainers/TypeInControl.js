//React modules
import React, { Component } from 'react';
import Radium, { Style } from 'radium';

//Material UI Components
import TextField from 'material-ui/TextField';

//Utils
import getStyles from '../../../utils/styleConverter';

const styles = {
    answerContainer: {
        display: 'inline-block',
        position: 'relative'
    },

    realText: {
        opacity: '0',
        textAlign: 'left',
        whiteSpace: 'nowrap',
        visibility: 'hidden'
    },

    inputRootStyle: {
        base: {
            display: 'inline-block',
            verticalAlign: 'middle',
            width: '100%',
            height: '60px',
            position: 'absolute',
            top: '-5px',
            right: '0',
            left: '0',
            bottom: '0'
        },
      
        placeholderTypeIn: {
            height: '40px',
            top: '-10px'
        }
    },

    inputStyle: {
        display: 'inline-block',
        width: '100%'
    },

    property: {
        display: 'inline-block',
        verticalAlign: 'middle',
        padding: '4px'
    },

    resultText: {
        position: 'absolute',
        top: '0',
        right: '0',
        left: '0',
        bottom: '0'
    },

    correctStyle: {
        color: '#0f9d58'
    },

    wrongStyle: {
        color: '#bb0909'
    }
}

class TypeInControl extends Component {
    constructor(props) {       
        super(props);
        this.answer = this.props.answer;
        this.realText = this.answer.text;
        this.desiredText = this.answer.text.toLowerCase();
        this.isCorrect = false;
        this.state = {
            maxLength: this.realText.length,
            isChecked: this.props.isChecked,
            correctText: "",
            wrongText: "",
            text : ""
        }
    }

    unlock() {
        this.setState({ correctText: this.desiredText });
        this.isCorrect = true;
    }

    getInput(targetValue) {
        var input = targetValue.trim().toLowerCase();
        if (input.length > this.realText.length) {
            input = input.substr(0, this.realText.length);
        }
        return input;
    };


    onChange = (e) => {
        let targetValue = e.target.value;
        this.setState({
            text : targetValue
        });
        let input = this.getInput(targetValue);
        let desiredText = this.desiredText;
        if (desiredText.indexOf(input) == 0) {
            this.setState({
                correctText: input,
                wrongText: ""
            });
        }
        else {
            for (let i = 0; i < input.length && i < desiredText.length; i++) {
                if (input[i] != desiredText[i]) {
                    this.setState({
                        correctText: this.realText.substr(0, i),
                        wrongText: input.substr(i)
                    });
                    break;
                }
            }
        }

        this.isCorrect = desiredText == input;
    }  

    check() {
        return this.isCorrect;
    }

    render() {
        const defaultFontSize = this.props.fontSize;

        const additionalStyles = {
            fontSize: defaultFontSize  + "px"
        }

        return (
            <div className="typeIn-control" style={styles.answerContainer}>
                <div className="prefix" style={styles.property}>{this.answer.properties.prefix}</div>
                <div className="answer" style={styles.answerContainer}>
                    <span className="realText" style={styles.realText}>{this.realText}</span>

                    { this.state.isChecked
                        ? <div className="resultText" style={styles.resultText}>
                              <span className="correct" style={styles.correctStyle}>{this.state.correctText}</span>
                              <span className="wrong" style={styles.wrongStyle}>{this.state.wrongText}</span>
                          </div>
                        :
                        <TextField
                            name="type-in-control"
                            key={this.answer.id}
                            ref="material-typeIn"
                            maxLength={this.state.maxLength}
                            value={this.state.text}
                            onChange={this.onChange}
                            style={this.props.singleTipeIn ? getStyles(styles.inputRootStyle.base, additionalStyles) : getStyles(styles.inputRootStyle.base, styles.inputRootStyle.placeholderTypeIn, additionalStyles)}
                            inputStyle={ styles.inputStyle}
                        />
                     }
                </div>
                <div className="postfix" style={styles.property}>{this.answer.properties.postfix}</div>
            </div>
        );
    }

    componentWillReceiveProps(nextProps) {
        // You don't have to do this check first, but it can help prevent an unneeded render
        if (nextProps.isChecked !== this.state.isChecked) {
            this.setState({ isChecked: nextProps.isChecked });
        }
    }
}

export default Radium(TypeInControl);