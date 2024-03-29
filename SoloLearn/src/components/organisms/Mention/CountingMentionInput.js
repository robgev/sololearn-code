import React, { Component } from 'react';
import { FlexBox } from 'components/atoms';
import MentionInput from './MentionInput';
import './countingMentionInput.scss';

class CountingMentionInput extends Component {
	static defaultProps = {
		maxLength: 2048,
		renderButton: () => null,
		onSubmitEnabledChange: () => { }, // noop
		className: '',
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
			containerStyle, counterStyle, renderButton, className, ...rest
		} = this.props;
		const { isExpanded, charCount } = this.state;
		return (
			<FlexBox column={isExpanded} justifyBetween fullWidth className="organism_counting-mention-input">
				<FlexBox fullWidth>
					<MentionInput
						ref={this.mentionInput}
						onLengthChange={this.onLengthChange}
						onFocus={this.onFocus}
						onBlur={this.onBlur}
						maxLength={this.props.maxLength}
						charCount={charCount}
						className={`${className} ${isExpanded ? 'expanded' : ''}`}
						{...rest}
					/>
				</FlexBox>
				<FlexBox className="bottom-toolbar-container">
					{renderButton({ isExpanded, charCount, onBlur: this.onBlur })}
				</FlexBox>
			</FlexBox>
		);
	}
}

export default CountingMentionInput;
