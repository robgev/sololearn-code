import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { getCommonPrefix } from 'utils';
import quizType from './types';

class TypeIn extends Component {
	state = {
		text: '',
	}
	correctAnswer = this.props.quiz.answers[0];
	componentDidMount() {
		this.input.focus();
	}
	_onChange = (_, text) => {
		this.setState({ text: text.toLowerCase() });
		this.props.onChange({ isComplete: this.isComplete(text) });
		if (text.length === this.correctAnswer.text.length) {
			this.input.blur();
		}
	}
	isComplete = text => text.length === this.correctAnswer.text.length
	tryAgain = () => {
		this.setState({ text: '' });
	}
	check = () => this.state.text === this.correctAnswer.text
	unlock = () => {
		this.setState({ text: this.correctAnswer.text });
	}
	hint = () => {
		const prefix = getCommonPrefix(this.state.text, this.correctAnswer.text);
		const text = prefix.length < this.correctAnswer.text.length
			? prefix + this.correctAnswer.text[prefix.length]
			: prefix;
		this.setState({ text });
		return text === this.correctAnswer.text;
	}
	render() {
		const { text } = this.state;
		const { disabled } = this.props;
		return (
			<div className="question-container" >
				<p className="question-text">{this.props.quiz.question}</p>
				<div className="placeholder-container">
					<span>{this.correctAnswer.properties.prefix}</span>
					{
						disabled
							? (
								<span style={{ fontSize: 18 }}>
									<span style={{ color: 'green' }}>
										{getCommonPrefix(text, this.correctAnswer.text)}
									</span>
									<span style={{ color: 'red' }}>
										{text.slice(getCommonPrefix(text, this.correctAnswer.text).length)}
									</span>
								</span>
							) : <TextField
								name="answer-placeholder"
								maxLength={this.correctAnswer.text.length}
								style={{ width: `${this.correctAnswer.text.length}em` }}
								inputStyle={{ textAlign: 'center', overflow: 'hidden', fontFamily: 'monospace' }}
								value={text}
								onChange={this._onChange}
								ref={(i) => { this.input = i; }}
							/>
					}
					<span>{this.correctAnswer.properties.postfix}</span>
				</div>
			</div>
		);
	}
}

TypeIn.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default TypeIn;
