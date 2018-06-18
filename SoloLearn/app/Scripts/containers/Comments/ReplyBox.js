// React modules
import React, { Component } from 'react';
import PropTypes from 'prop-types';

// Material UI components
import { FlatButton, IconButton, TextField } from 'material-ui';
import { grey600 } from 'material-ui/styles/colors';
import Close from 'material-ui/svg-icons/content/clear';

// Additional components
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import MentionInput from 'components/Shared/MentionInput';

import { getMentionsList } from 'utils';

// i18n
import { translate } from 'react-i18next';

// Styles
import { ReplyBoxStyle as styles } from './styles';

class ReplyBox extends Component {
	state = {
		isReplyOpen: false,
		replyLength: 0,
	}
	focus = () => {
		console.log('should focus');
		this.mentionInput.focus();
	}
	openReply = () => {
		this.setState({ isReplyOpen: true });
	}
	closeReply = () => {
		this.setState({ isReplyOpen: false });
	}
	onLengthChange = (replyLength) => {
		if (this.mentionInput) {
			this.setState({ replyLength });
		}
	}
	submitReply = () => {
		this.props.save(this.mentionInput.popValue());
	}
	getMentionFetcher = (type, id) => {
		switch (type) {
		case 'lesson':
			return getMentionsList('lessonComment', { quizId: id });
		case 'code':
			return getMentionsList('codeComment', { codeId: id });
		case 'userLesson':
			return getMentionsList('userLessonComment', { lessonId: id });
		default:
			throw new Error('Comment type is not defined');
		}
	}
	render() {
		const {
			userName, profile, commentType, t, id,
		} = this.props;
		const { replyLength, isReplyOpen } = this.state;
		const getUsers = this.getMentionFetcher(commentType, id);
		return (
			<div style={styles.replyBox.base}>
				{
					userName != null &&
					<div style={styles.replyBoxToolbar}>
						<p style={styles.replyBoxToolbarText}>
							Replying to <span style={styles.replyBoxToolbarText.user}>{userName}</span>
						</p>
						<IconButton
							onClick={this.props.closeToolbar}
							iconStyle={styles.close.icon.small}
							style={{ ...styles.close.button.reply, ...styles.close.button.small }}
						>
							<Close color={grey600} />
						</IconButton>
					</div>
				}
				<div>
					<div style={styles.replyBoxConent}>
						<ProfileAvatar
							size={40}
							userID={profile.id}
							badge={profile.badge}
							userName={profile.name}
							avatarUrl={profile.avatarUrl}
						/>
						<div style={styles.replyBoxDetails}>
							<span style={styles.userName}>{profile.name}</span>
							<MentionInput
								ref={(input) => { this.mentionInput = input; }}
								onFocus={this.openReply}
								onBlur={this.closeReply}
								onLengthChange={this.onLengthChange}
								style={{ minHeight: 160 }}
								getUsers={getUsers}
								submit={this.props.save}
								placeholder={!isReplyOpen && replyLength === 0 ? 'Write a new answer' : ''}
							/>
						</div>
					</div>
					<div style={styles.replyBoxControls}>
						<FlatButton
							label={t('comments.add')}
							disabled={replyLength === 0}
							primary
							onClick={this.submitReply}
						/>
					</div>
				</div>
			</div>
		);
	}
}

ReplyBox.propTypes = {
	save: PropTypes.func.isRequired,
	commentType: PropTypes.oneOf([ 'lesson', 'code', 'userLesson' ]).isRequired,
	id: PropTypes.number.isRequired,
};

export default translate(null, { withRef: true })(ReplyBox);
