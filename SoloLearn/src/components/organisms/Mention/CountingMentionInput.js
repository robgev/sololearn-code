import React, { Component } from 'react';
import { Container, SecondaryTextBlock, FlexBox } from 'components/atoms';
import MentionInput from './MentionInput';
import './countingMentionInput.scss';

class CountingMentionInput extends Component {
	static defaultProps = {
		maxLength: 2048,
		renderButton: () => null,
		onSubmitEnabledChange: () => { }, // noop
	}
	constructor(props) {
		super(props);
		this.mentionInput = React.createRef();
		this.state = {
			charCount: 0,
			isExpanded: this.props.autofocus,
		};
	}
	onFocus = () => {
		this.setState({ isExpanded: true });
	}
	onBlur = () => {
		this.setState({ isExpanded: false });
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
	blur = () => {
		this.mentionInput.current.blur();
	}
	isEmpty = () => this.getValue().trim().length === 0;
	render() {
		const {
			containerStyle, counterStyle, renderButton, ...rest
		} = this.props;
		const { isExpanded, charCount } = this.state;
		return (
			<Container className="organism_counting-mention-input">
				<MentionInput
					ref={this.mentionInput}
					onLengthChange={this.onLengthChange}
					onFocus={this.onFocus}
					onBlur={this.onBlur}
					className={isExpanded ? 'expanded' : ''}
					{...rest}
				/>
				<FlexBox className="bottom-toolbar-container">
					<SecondaryTextBlock className="counter">
						{charCount} / {this.props.maxLength}
					</SecondaryTextBlock>
					{renderButton({ isExpanded })}
				</FlexBox>
			</Container>
		);
	}
}

export default CountingMentionInput;
