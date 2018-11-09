import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { Container, HorizontalDivider } from 'components/atoms';
import { RaisedButton } from 'components/molecules';
import { CountingMentionInput } from 'components/organisms';

@translate()
class AddReply extends Component {
	state = {
		isSubmitEnabled: false,
	}

	input = React.createRef();

	setIsSubmitEnabled = (isSubmitEnabled) => {
		this.setState({ isSubmitEnabled });
	}

	submit = () => {
		this.props.submit(this.input.current.popValue());
	}

	render() {
		const { t, postID } = this.props;
		const { isSubmitEnabled } = this.state;
		return (
			<Container className="add-reply">
				<CountingMentionInput
					ref={this.input}
					placeholder={t('discuss.new-answer-placeholder')}
					getUsers={{ type: 'discuss', params: { postId: postID } }}
					onSubmitEnabledChange={this.setIsSubmitEnabled}
				/>
				<RaisedButton
					className={`post-button ${isSubmitEnabled ? 'enabled' : ''}`}
					disabled={!isSubmitEnabled}
					onClick={this.submit}
				>
					{t('common.post-action-title')}
				</RaisedButton>
				<HorizontalDivider />
			</Container>
		);
	}
}

export default AddReply;

/* <MentionInput
	ref={(input) => { this.mentionInput = input; }}
	onFocus={this.openReplyBox}
	onBlur={this.handleBlur}
	onLengthChange={this.onLengthChange}
	style={isReplyBoxOpen ? { height: 100 } : {}}
	getUsers={{ type: 'discuss', params: { postId: this.props.postId } }}
	submit={this.props.save}
	placeholder={!isReplyBoxOpen && replyLength === 0 ? t('discuss.new-answer-placeholder') : ''}
/> */
