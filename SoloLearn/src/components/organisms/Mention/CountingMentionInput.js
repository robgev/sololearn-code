import React, { Component } from 'react';
import { Container, SecondaryTextBlock } from 'components/atoms';
import MentionInput from './MentionInput';
import './countingMentionInput.scss';

class CountingMentionInput extends Component {
	static defaultProps = {
		maxLength: 2048,
		onSubmitEnabledChange: () => { }, // noop
	}
	constructor(props) {
		super(props);
		this.mentionInput = React.createRef();
		this.state = {
			charCount: 0,
			isExtended: false,
		};
	}
	onFocus = () => {
		this.setState({ isExtended: true });
	}
	onBlur = () => {
		this.setState({ isExtended: false });
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
			<Container className="organism_counting-mention-input">
				<MentionInput
					ref={this.mentionInput}
					onLengthChange={this.onLengthChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					className={this.state.isExtended ? 'expanded' : ''}
					{...rest}
				/>
				<SecondaryTextBlock className="counter">
					{this.state.charCount} / {this.props.maxLength}
				</SecondaryTextBlock>
			</Container>
		);
	}
}

export default CountingMentionInput;
