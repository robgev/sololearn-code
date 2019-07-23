import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { PaperContainer, FlexBox, IconLabel } from 'components/atoms';
import {
	PromiseButton,
	ProfileAvatar,
	IconWithText,
	FlatButton,
} from 'components/molecules';
// this should be changed to svg icon
import { Answer } from 'components/icons';
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

	submit = () => this.props.submit(this.input.current.popValue())
		.then(() => {
			// this.input.current.focus();
			this.input.current.blur();
		});

	renderSubmitButton = ({ isExpanded, charCount }) => {
		const { t } = this.props;
		const { isSubmitEnabled } = this.state;
		return (
			<FlexBox
				className="add-reply-action-container"
				style={{ marginTop: isExpanded ? 8 : 0 }}
				align
			>
				{isExpanded &&
					<FlatButton
						className="cancel-button"
						onClick={() => this.input.current.blur()}
						onMouseDown={() => this.input.current.blur()}
					>
						{t('common.cancel-title')}
					</FlatButton>
				}
				<PromiseButton
					className={`post-button ${isSubmitEnabled ? 'enabled' : ''}`}
					disabled={!isSubmitEnabled}
					fire={this.submit}
					mouseDown
					style={{ marginLeft: isExpanded ? 24 : 16 }}
					raised
				>
					<IconWithText
						Icon={Answer}
						isIconComponent
						className="answer-icon"
					>
						{ /* needs translation */ }
						<IconLabel className="add-reply-button-label">
							Answer
						</IconLabel>
					</IconWithText>
				</PromiseButton>
			</FlexBox>
		);
	}

	render() {
		const { t, postID, userProfile } = this.props;
		return (
			<PaperContainer className="add-reply">
				<FlexBox>
					<ProfileAvatar user={userProfile} />
					{ /* placeholder needs translation */ }
					<CountingMentionInput
						className="reply-editor"
						ref={this.input}
						placeholder="Write your reply here"
						getUsers={{ type: 'discuss', params: { postId: postID } }}
						onSubmitEnabledChange={this.setIsSubmitEnabled}
						renderButton={this.renderSubmitButton}
					/>
				</FlexBox>
			</PaperContainer>
		);
	}
}

export default connect(mapStateToProps)(AddReply);
