// React modules
import React, { Component } from 'react';

// Material UI components
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import IconButton from 'material-ui/IconButton';
import { grey600 } from 'material-ui/styles/colors';
import Close from 'material-ui/svg-icons/content/clear';

// Additional components
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LoadingOverlay from 'components/Shared/LoadingOverlay';

const styles = {
	replyBox: {
		base: {
			width: 'inherit',
			margin: '0 auto 10px',
			backgroundColor: '#fff',
		},

		elevated: {
			zIndex: 1001,
		},
	},

	avatar: {
		overflow: 'hidden',
		float: 'left',
	},

	replyBoxConent: {
		overflow: 'hidden',
		padding: '8px 5px 5px 5px',
	},

	replyBoxDetails: {
		overflow: 'hidden',
		padding: '0 0 0 10px',
	},

	userName: {
		fontSize: '15px',
		fontWeight: '500',
		textDecoration: 'none',
	},

	replyBoxControls: {
		overflow: 'hidden',
		padding: '0 5px 5px 0',
		textAlign: 'right',
	},

	textField: {
		fontSize: '13px',
		margin: '0 0 10px 0',
	},

	replyBoxToolbar: {
		overflow: 'hidden',
		padding: '5px',
		borderBottom: '1px solid #dedede',
		fontSize: '13px',
		color: '#928f8f',
	},

	replyBoxToolbarText: {
		float: 'left',
		margin: '5px 0 0 0',

		user: {
			fontWeight: 500,
		},
	},

	close: {
		button: {
			reply: {
				float: 'right',
				verticalAlign: 'middle',
			},

			small: {
				width: '24px',
				height: '24px',
				padding: '6px',
			},
		},

		icon: {
			small: {
				width: '12px',
				height: '12px',
			},
		},
	},
};

class ReplyBox extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isLoading: false,
			errorText: '',
			textFieldValue: '',
		};

		this.submitReply = this.submitReply.bind(this);
	}

	onChange(e) {
		if (e.target.value.length === 0) {
			this.setState({
				textFieldValue: e.target.value,
				errorText: 'This field is required',
			});
		} else {
			this.setState({
				textFieldValue: e.target.value,
				errorText: '',
			});
		}
	}

	submitReply() {
		this.setState({ isLoading: true });

		this.props.reply(this.state.textFieldValue).then(() => {
			this.setState({
				isLoading: false,
				errorText: '',
				textFieldValue: '',
			});
		});
	}

	render() {
		const {
			isPrimary, userName, defaultText, profile,
		} = this.props;
		const replyDisabled = this.state.errorText.length === 0;

		return (
			<div
				id="reply-box-wrapper"
				style={{ ...styles.replyBox.base, ...(!isPrimary ? styles.replyBox.elevated : {}) }}
			>
				{this.state.isLoading && <LoadingOverlay withBackground size={30} />}
				{!isPrimary &&
				<div className="toolbar" style={styles.replyBoxToolbar}>
					<p style={styles.replyBoxToolbarText}>
						Replying to <span style={styles.replyBoxToolbarText.user}>{userName}</span>
					</p>
					<IconButton className="cancel-reply" style={{ ...styles.close.button.reply, ...styles.close.button.small }} iconStyle={styles.close.icon.small} onClick={this.props.closeToolbar}>
						<Close color={grey600} />
					</IconButton>
				</div>
				}
				<div className="reply-box">
					<div className="content" style={styles.replyBoxConent}>
						<ProfileAvatar
							size={40}
							userID={profile.id}
							userName={profile.name}
							avatarUrl={profile.avatarUrl}
						/>
						<div className="comment-details" style={styles.replyBoxDetails}>
							<span className="name" style={styles.userName}>{profile.name}</span>
							<TextField
								hintText="Message"
								multiLine
								rowsMax={4}
								fullWidth
								style={styles.textField}
								key={defaultText}
								errorText={this.state.errorText}
								defaultValue={defaultText}
								onChange={e => this.onChange(e)}
							/>
						</div>
					</div>
					<div className="controls" style={styles.replyBoxControls}>
						<FlatButton label="Reply" primary={replyDisabled} disabled={!replyDisabled} onClick={this.submitReply} />
					</div>
				</div>
			</div>
		);
	}
}

export default ReplyBox;
