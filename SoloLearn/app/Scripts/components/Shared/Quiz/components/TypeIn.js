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
	tryAgain = () => {
		this.props.onTryAgain();
		this.setState({ text: '', checkResult: null });
	}
	onChange = (_, text) => {
		this.setState({ text });
	}
	check = () => {
		this.setState(
			state => ({ checkResult: state.text === this.correctAnswer.text }),
			() => {
				this.props.onCheck(this.state.checkResult);
			},
		);
	}
	unlock = () => {
		if (this.props.onUnlock()) {
			this.setState({ text: this.correctAnswer.text });
			this.check();
		}
	}
	hint = () => {
		if (this.props.onHint()) {
			const prefix = getCommonPrefix(this.state.text, this.correctAnswer.text);
			const text = prefix.length < this.correctAnswer.text.length
				? prefix + this.correctAnswer.text[prefix.length]
				: prefix;
			this.setState({ text });
			if (text === this.correctAnswer.text) { this.check(); }
		}
	}
	isComplete = () => this.state.text.length === this.correctAnswer.text.length
	render() {
		const { text, checkResult } = this.state;
		const { canTryAgain } = this.props;
		const isChecked = checkResult !== null;
		return (
			<div className="quiz" >
				{
					this.props.unlockable &&
					<TopBar onUnlock={this.unlock} disabled={isChecked} hintable onHint={this.hint} />
				}
				<Paper className="question-container" >
					<p className="question-text" style={{ whiteSpace: 'pre' }}>{this.props.quiz.question}</p>
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
						onClick={isChecked ? this.tryAgain : this.check}
						disabled={!this.isComplete() || (isChecked && !canTryAgain)}
						label={isChecked && canTryAgain ? 'Try again' : 'Check'}
					/>
					<CheckIndicator status={checkResult} />
				</div>
			</div>
		);
	}
}

TypeIn.defaultProps = {
	onCheck: () => { },
	onHint: () => false,
	onUnlock: () => false,
};

TypeIn.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
	onCheck: PropTypes.func, // handles side effects based on check result
	onHint: PropTypes.func, // returns true if can hint and handles side effects
	onUnlock: PropTypes.func, // returns true if can unlock and handles side effects
	canTryAgain: PropTypes.bool.isRequired,
	onTryAgain: PropTypes.func.isRequired,
};

export default TypeIn;
