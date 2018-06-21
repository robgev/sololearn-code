import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Paper, RaisedButton } from 'material-ui';
import { getCommonPrefix } from 'utils';
import TopBar from './TopBar';
import { quizType } from './types';

class TypeIn extends Component {
	state = {
		text: '',
	}
	correctAnswer = this.props.quiz.answers[0];
	onChange = (_, text) => {
		this.setState({ text });
	}
	check = () => this.state.text === this.correctAnswer;
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
		return (
			<div className="quiz">
				{this.props.unlockable && <TopBar onUnlock={this.unlock} />}
				<Paper className="question-container">
					<p className="question-text">{this.props.quiz.question}</p>
					<div className="placeholder-container">
						<span>{this.correctAnswer.properties.prefix}{'<'}</span>
						<TextField
							name="answer-placeholder"
							maxLength={this.correctAnswer.text.length}
							style={{ width: `${this.correctAnswer.text.length}em` }}
							inputStyle={{ textAlign: 'center' }}
							value={this.state.text}
							onChange={this.onChange}
						/>
						<span>{this.correctAnswer.properties.postfix}{'/>'}</span>
					</div>
				</Paper>
				<RaisedButton
					fullWidth
					secondary
					onClick={this.check}
					disabled={this.state.text.length !== this.correctAnswer.text.length}
					label="Check"
				/>
			</div>
		);
	}
}

TypeIn.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
};

export default TypeIn;
