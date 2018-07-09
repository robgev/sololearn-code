import React, { Component } from 'react';
import PropTypes from 'prop-types';
import TextField from 'material-ui/TextField';
import { getCommonPrefix } from 'utils';
import quizType from './types';

// Pure utils
const formatAnswers = (answerText, inputs, onChange, disabled, addRefOnIndex, focusNext) => {
	const regex = /\{(\d)}/;
	return answerText
		.split(regex).reduce((acc, curr, index) => (acc.isMark
			? ({
				result: [ ...acc.result,
				// eslint-disable-next-line react/no-array-index-key
					<div key={index} style={{ display: 'inline-block' }}>
						<span>{inputs[curr].properties.prefix}</span>
						{
							disabled
								? (
									<span>
										<span style={{ color: 'green' }}>
											{getCommonPrefix(inputs[curr].text, inputs[curr].correct)}
										</span>
										<span style={{ color: 'red' }}>
											{inputs[curr].text
												.slice(getCommonPrefix(inputs[curr].text, inputs[curr].correct).length)}
										</span>
									</span>
								)
								: <TextField
									ref={i => addRefOnIndex(i, parseInt(curr, 10))}
									inputStyle={{ textAlign: 'center', overflow: 'hidden' }}
									id={inputs[curr].id.toString()}
									value={inputs[curr].text}
									style={{ width: `${inputs[curr].correct.length}em` }}
									onChange={(_, text) => {
										onChange(text, inputs[curr].id);
										if (text.length === inputs[curr].correct.length) {
											focusNext(parseInt(curr, 10));
										}
									}
									}
									maxLength={inputs[curr].correct.length}
								/>
						}
						<span>{inputs[curr].properties.postfix}</span>
					</div>,
				],
				isMark: false,
			})
			: ({
				// eslint-disable-next-line react/no-array-index-key
				result: [ ...acc.result, <span style={{ whiteSpace: 'pre-wrap' }} key={index}>{curr}</span> ], isMark: true,
			})), { result: [], isMark: false }).result;
};

class FillIn extends Component {
	state = {
		inputs: this.props.quiz.answers
			.map(answer => ({
				correct: answer.text, id: answer.id, text: '', properties: answer.properties,
			})),
	}
	inputRefs = new Array(this.props.quiz.answers.length);
	question = this.props.quiz.question.split(/\[!\w+!]/)[0];
	answerText = this.props.quiz.question.split(/\[!\w+!]/)[1];
	componentDidMount() {
		if (this.inputRefs[0] != null) {
			this.inputRefs[0].focus();
		}
	}
	addRefOnIndex = (input, index) => {
		this.inputRefs[index] = input;
	}
	focusNext = (index) => {
		if (this.inputRefs[index + 1] != null) {
			this.inputRefs[index + 1].focus();
		} else {
			this.inputRefs[index].blur();
		}
	}
	_onAnswerChange = (text, inputId) => {
		const inputs = this.state.inputs.map(i => (i.id === inputId ? { ...i, text } : i));
		this.setState({ inputs });
		this.props.onChange({ isComplete: this.isComplete(inputs) });
	}
	isComplete = inputs => !inputs.some(a => a.text.length !== a.correct.length)
	tryAgain = () => {
		this.setState({
			inputs: this.props.quiz.answers
				.map(answer => ({
					correct: answer.text, id: answer.id, text: '', properties: answer.properties,
				})),
		});
	}
	check = () => !this.state.inputs.some(a => a.correct !== a.text)
	unlock = () => {
		this.setState(state => ({ inputs: state.inputs.map(i => ({ ...i, text: i.correct })) }));
	}
	hint = () => {
		const inputs = this.state.inputs.map((input) => {
			const prefix = getCommonPrefix(input.text, input.correct);
			const text = prefix.length < input.correct.length
				? prefix + input.correct[prefix.length]
				: prefix;
			return { ...input, text };
		});
		this.setState({ inputs });
		return !inputs.some(a => a.correct !== a.text);
	}
	render() {
		const { disabled } = this.props;
		return (
			<div className="question-container">
				<p className="question-text">{this.question}</p>
				<div className="fill-in-answers-container">
					{formatAnswers(
						this.answerText,
						this.state.inputs,
						this._onAnswerChange,
						disabled,
						this.addRefOnIndex,
						this.focusNext,
					)}
				</div>
			</div>
		);
	}
}

FillIn.propTypes = {
	quiz: quizType.isRequired,
	disabled: PropTypes.bool.isRequired,
	onChange: PropTypes.func.isRequired,
};

export default FillIn;
