import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { TextField, Paper, RaisedButton } from 'material-ui';
import { getCommonPrefix } from 'utils';
import TopBar from './TopBar';
import CheckIndicator from './CheckIndicator';
import { quizType } from './types';

class TypeIn extends Component {
	state = {
		text: '',
		checkResult: null,
	}
	correctAnswer = this.props.quiz.answers[0];
	onChange = (_, text) => {
		this.setState({ text });
	}
	check = () => {
		this.setState(state => ({ checkResult: state.text === this.correctAnswer.text }));
	}
	unlock = () => {
		this.setState({ text: this.correctAnswer.text });
		this.check();
	}
	hint = () => {
		const prefix = getCommonPrefix(this.state.text, this.correctAnswer.text);
		const text = prefix.length < this.correctAnswer.text.length
			? prefix + this.correctAnswer.text[prefix.length]
			: prefix;
		this.setState({ text });
		if (text === this.correctAnswer.text) { this.check(); }
	}
	render() {
		const { text, checkResult } = this.state;
		const isChecked = checkResult !== null;
		return (
			<div className="quiz">
				{this.props.unlockable &&
					<TopBar onUnlock={this.unlock} disabled={isChecked} hintable onHint={this.hint} />}
				<Paper className="question-container">
					<p className="question-text">{this.props.quiz.question}</p>
					<div className="placeholder-container">
						<span>{this.correctAnswer.properties.prefix}</span>
						<TextField
							name="answer-placeholder"
							maxLength={this.correctAnswer.text.length}
							style={{ width: `${this.correctAnswer.text.length}em` }}
							inputStyle={{ textAlign: 'center' }}
							value={text}
							onChange={this.onChange}
							disabled={isChecked}
						/>
						<span>{this.correctAnswer.properties.postfix}</span>
					</div>
				</Paper>
				<div className="check-container">
					<RaisedButton
						secondary
						disabled={text.length !== this.correctAnswer.text.length}
						onClick={this.check}
						label="Check"
					/>
					<CheckIndicator status={checkResult} />
				</div>
			</div>
		);
	}
}

TypeIn.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
};

export default TypeIn;
