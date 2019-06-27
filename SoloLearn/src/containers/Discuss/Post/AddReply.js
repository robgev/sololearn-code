import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, PaperContainer, FlexBox } from 'components/atoms';
import { RaisedButton, ProfileAvatar } from 'components/molecules';
import { CountingMentionInput } from 'components/organisms';

const mapStateToProps = ({ userProfile }) => ({ userProfile });

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
		this.input.current.blur();
		this.props.submit(this.input.current.popValue());
	}

	onEnter = (e) => {
		if (e.keyCode === 13) {
			this.submit();
		}
	}

	renderSubmitButton = ({ isExpanded, charCount }) => {
		const { t } = this.props;
		const { isSubmitEnabled } = this.state;
		return (
			<RaisedButton
				className={`post-button ${isSubmitEnabled ? 'enabled' : ''}`}
				disabled={!isSubmitEnabled}
				onMouseDown={this.submit}
				onKeyDown={this.onEnter}
			>
				{t('common.post-action-title')}
			</RaisedButton>
		);
	}

	render() {
		const { t, postID, userProfile } = this.props;
		return (
			<PaperContainer className="add-reply">
				<FlexBox>
					<ProfileAvatar user={userProfile} />
					<CountingMentionInput
						className="reply-editor"
						ref={this.input}
						placeholder={t('discuss.new-answer-placeholder')}
						getUsers={{ type: 'discuss', params: { postId: postID } }}
						onSubmitEnabledChange={this.setIsSubmitEnabled}
						renderButton={this.renderSubmitButton}
					/>
				</FlexBox>
				{/* <HorizontalDivider /> */}
			</PaperContainer>
		);
	}
}

export default connect(mapStateToProps)(AddReply);
