import React, { Component } from 'react';
import { TextField } from 'material-ui';
import { getCommonPrefix } from 'utils';
import answersType from './answersType';

class TypeIn extends Component {
	state = {
		text: '',
	}
	correctAnswer = this.props.answers[0].text;
	onChange = (_, text) => {
		if (text.length <= this.correctAnswer.lenght) {
			this.setState({ text });
		}
	}
	check = () => this.state.text === this.correctAnswer;
	unlock = () => {
		this.setState({ text: this.correctAnswer });
	}
	hint = () => {
		const prefix = getCommonPrefix(this.state.text, this.correctAnswer);
		const text = prefix.length < this.correctAnswer.length
			? prefix + this.correctAnswer[prefix.length]
			: prefix;
		this.setState({ text });
		return text === this.correctAnswer;
	}
	render() {
		return (
			<div>
				<span>{this.correctAnswer.properties.prefix}</span>
				<TextField value={this.state.text} onChange={this.onChange} />
				<span>{this.correctAnswer.properties.postfix}</span>
			</div>
		);
	}
}

TypeIn.propTypes = {
	answers: answersType.isRequired,
};

export default TypeIn;
