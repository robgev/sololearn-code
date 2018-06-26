import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Paper, RaisedButton, TextField } from 'material-ui';
import { getCommonPrefix } from 'utils';
import TopBar from './TopBar';
import CheckIndicator from './CheckIndicator';
import { quizType } from './types';

// Pure utils
const formatAnswers = (answerText, inputs, onChange, disabled) => {
	const regex = /\{(\d)}/;
	return answerText
		.split(regex).reduce((acc, curr) => (acc.isMark
			? ({
				result: [ ...acc.result,
					<div key={curr} style={{ display: 'inline-block' }}>
						<span>{inputs[curr].properties.prefix}</span>
						<TextField
							inputStyle={{ textAlign: 'center' }}
							id={inputs[curr].id.toString()}
							value={inputs[curr].text}
							style={{ width: `${inputs[curr].correct.length}em` }}
							onChange={(_, text) => onChange(text, inputs[curr].id)}
							maxLength={inputs[curr].correct.length}
							disabled={disabled}
						/>
						<span>{inputs[curr].properties.postfix}</span>
					</div>,
				],
				isMark: false,
			})
			: ({
				result: [ ...acc.result, <span style={{ whiteSpace: 'pre' }} key={curr}>{curr}</span> ], isMark: true,
			})), { result: [], isMark: false }).result;
};

class FillIn extends Component {
	state = {
		checkResult: null,
		inputs: this.props.quiz.answers
			.map(answer => ({
				correct: answer.text, id: answer.id, text: '', properties: answer.properties,
			})),
	}
	question = this.props.quiz.question.split(/\[!\w+!]/)[0];
	answerText = this.props.quiz.question.split(/\[!\w+!]/)[1];
	tryAgain = () => {
		this.props.onTryAgain();
		this.setState({
			checkResult: null,
			inputs: this.props.quiz.answers
				.map(answer => ({
					correct: answer.text, id: answer.id, text: '', properties: answer.properties,
				})),
		});
	}
	onAnswerChange = (text, inputId) => {
		this.setState(state =>
			({ inputs: state.inputs.map(i => (i.id === inputId ? { ...i, text } : i)) }));
	}
	check = () => {
		this.setState(state => ({
			checkResult: !state.inputs.some(a => a.correct !== a.text),
		}), () => { this.props.onCheck(this.state.checkResult); });
	}
	forceTrue = () => {
		this.setState({ checkResult: true }, () => { this.props.onCheck(true); });
	}
	unlock = () => {
		if (this.props.onUnlock()) {
			this.setState(state => ({ inputs: state.inputs.map(i => ({ ...i, text: i.correct })) }));
			this.forceTrue();
		}
	}
	hint = () => {
		if (this.props.onHint()) {
			const inputs = this.state.inputs.map((input) => {
				const prefix = getCommonPrefix(input.text, input.correct);
				const text = prefix.length < input.correct.length
					? prefix + input.correct[prefix.length]
					: prefix;
				return { ...input, text };
			});
			this.setState({ inputs });
			if (!inputs.some(a => a.correct !== a.text)) { this.forceTrue(); }
		}
	}
	isComplete = () => !this.state.inputs.some(a => a.text.length !== a.correct.length)
	render() {
		const { checkResult } = this.state;
		const { canTryAgain } = this.props;
		const isChecked = checkResult !== null;
		return (
			<div className="quiz">
				{this.props.unlockable &&
					<TopBar disabled={isChecked} onUnlock={this.unlock} hintable onHint={this.hint} />}
				<Paper className="question-container">
					<p className="question-text">{this.question}</p>
					<div className="fill-in-answers-container">
						{formatAnswers(this.answerText, this.state.inputs, this.onAnswerChange, isChecked)}
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

FillIn.defaultProps = {
	onCheck: () => { },
	onUnlock: () => false,
	onHint: () => false,
};

FillIn.propTypes = {
	quiz: quizType.isRequired,
	unlockable: PropTypes.bool.isRequired,
	onCheck: PropTypes.func, // handles side effect after check
	onUnlock: PropTypes.func, // returns true if can unlock and handles side effects
	onHint: PropTypes.func, // returns true if can hint and handles side effects
	canTryAgain: PropTypes.bool.isRequired,
	onTryAgain: PropTypes.func.isRequired,
};

export default FillIn;
