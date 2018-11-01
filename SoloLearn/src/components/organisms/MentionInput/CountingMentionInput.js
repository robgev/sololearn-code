import React, { Component } from 'react';
import MentionInput from './MentionInput';

class CountingMentionInput extends Component {
	static defaultProps = {
		maxLength: 2048,
		onSubmitEnabledChange: () => { }, // noop
		containerStyle: { width: '100%' },
		counterStyle: {},
	}
	constructor(props) {
		super(props);
		this.mentionInput = React.createRef();
		this.state = {
			charCount: 0,
		};
	}
	onLengthChange = (charCount) => {
		this.setState({ charCount });
		const isSubmitEnabled = !this.isEmpty();
		this.props.onSubmitEnabledChange(isSubmitEnabled);
	}
	getValue = () => this.mentionInput.current.getValue();
	popValue = () => this.mentionInput.current.popValue();
	focus = () => {
		this.mentionInput.current.focus();
	}
	isEmpty = () => this.getValue().trim().length === 0;
	render() {
		const { containerStyle, counterStyle, ...rest } = this.props;
		return (
			<div style={containerStyle}>
				<MentionInput
					ref={this.mentionInput}
					onLengthChange={this.onLengthChange}
					{...rest}
				/>
				<span style={counterStyle}>{this.state.charCount} / {this.props.maxLength}</span>
			</div>
		);
	}
}

export default CountingMentionInput;
