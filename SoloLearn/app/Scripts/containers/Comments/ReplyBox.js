// React modules
import React, { Component } from 'react';

// Material UI components
import { TextField, FlatButton, IconButton } from 'material-ui';
import { grey600 } from 'material-ui/styles/colors';
import Close from 'material-ui/svg-icons/content/clear';

// Additional components
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

// Styles
import { ReplyBoxStyle as styles } from './styles';

// i18n
import { translate } from 'react-i18next';

class ReplyBox extends Component {
	state = {
		isLoading: false,
	};

	onReplyChange = e => this.props.setReplyText(e.target.value)

	submitReply = async () => {
		this.setState({ isLoading: true });
		await this.props.reply();
		this.setState({ isLoading: false });
	}

	render() {
		const {
			isPrimary,
			userName,
			profile,
			t,
		} = this.props;
		return (
			<div
				style={{ ...styles.replyBox.base, ...(!isPrimary ? styles.replyBox.elevated : {}) }}
			>
				{this.state.isLoading && <LoadingOverlay withBackground size={30} />}
				{
					!isPrimary &&
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
							<TextField
								name="replyText"
								hintText="Message"
								multiLine
								rowsMax={4}
								fullWidth
								style={styles.textField}
								value={this.props.replyText}
								onChange={this.onReplyChange}
								ref={this.props.inputRef}
							/>
						</div>
					</div>
					<div style={styles.replyBoxControls}>
						<FlatButton
							label={t('comments.add')}
							disabled={this.props.disabled}
							primary
							onClick={this.submitReply}
						/>
					</div>
				</div>
			</div>
		);
	}
}

export default translate()(ReplyBox);
