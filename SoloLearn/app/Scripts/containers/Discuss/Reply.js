// React modules
import React, { Component } from 'react';
import Radium from 'radium';
import {
	AutoSizer,
	CellMeasurer,
	CellMeasurerCache,
} from 'react-virtualized';

// Redux modules
import { connect } from 'react-redux';
import { editPostInternal, toggleAcceptedAnswerInternal } from '../../actions/discuss';
import getLikesInternal from '../../actions/likes';

// Material UI components
import Avatar from 'material-ui/Avatar';
import IconButton from 'material-ui/IconButton';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import TextField from 'material-ui/TextField';
import FlatButton from 'material-ui/FlatButton';
import AcceptedIcon from 'material-ui/svg-icons/navigation/check';
import { grey500, grey700, blueGrey500, lightGreen500 } from 'material-ui/styles/colors';
import DiscussAuthor from './DiscussAuthor';

// Utils
import numberFormatter from '../../utils/numberFormatter';
import updateDate from '../../utils/dateFormatter';
import getStyles from '../../utils/styleConverter';

import Likes from '../../components/Shared/Likes';

const cache = new CellMeasurerCache({
	defaultWidth: 100,
	minWidth: 75,
	fixedWidth: true,
});

export const styles = {
	reply: {
		base: {
			padding: '10px',
			borderBottom: '1px solid #f3f3f3',
			overflow: 'hidden',
		},

		accepted: {
			borderLeft: '4px solid #9ccc65',
		},
	},

	stats: {
		textAlign: 'center',
		width: '45px',
		fontSize: '14px',
	},

	vote: {
		button: {
			base: {
				width: '32px',
				height: '32px',
				padding: '8px',
			},

			icon: {
				width: '16px',
				height: '16px',
			},
		},

		text: {
			minWidth: '23px',
			textAlign: 'center',
			fontWeight: '500',
			fontSize: '14px',
		},
	},

	detailsWrapper: {
		overflow: 'hidden',
		display: 'flex',
	},

	details: {
		base: {
			overflow: 'hidden',
			margin: '7px 0 0 10px',
			width: '90%',
		},

		editing: {
			width: '95%',
		},
	},

	title: {
		fontSize: '15px',
		color: '#636060',
		margin: '0 0 5px 0',
	},

	message: {
		fontSize: '14px',
		color: '#827e7e',
		margin: '5px 0 10px 0',
		whiteSpace: 'pre-line',
	},

	additionalDetails: {
		overflow: 'hidden',
	},

	bestAnswerButton: {
		base: {
			width: '40px',
			height: '40px',
			padding: '10px',
		},

		icon: {
			width: '20px',
			height: '20px',
		},

		margin: {
			margin: '0 0 0 10px',
		},
	},

	authorDetails: {
		float: 'right',
		fontSize: '12px',
	},

	texts: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			textAlign: 'right',
		},

		userName: {
			color: '#607D8B',
			margin: '0 0 2px 0',
		},

		date: {
			color: '#777',
		},
	},

	avatar: {
		margin: '0 0 0 5px',
	},

	editor: {
		position: 'relative',
		padding: '0 0 10px 0',
	},

	textField: {
		margin: 0,
		fontSize: '13px',
	},

	textFieldCoutner: {
		position: 'absolute',
		bottom: 0,
		right: 0,
		fontSize: '13px',
		fontWeight: '500',
	},

	editorActions: {
		textAlign: 'right',
		margin: '5px 0 0 0',
	},
};

class Reply extends Component {
	constructor(props) {
		super(props);

		this.state = {
			isEditing: false,
			textFieldValue: this.props.reply.message,
			errorText: '',
		};
	}

	shouldComponentUpdate(nextProps, nextState) {
		return (JSON.stringify(this.props) !== JSON.stringify(nextProps) ||
			this.state !== nextState);
	}

	getLikes = () => {
		this.props.getLikes(this.props.reply.id);
	}

	getEditableArea = () => {
		const { reply } = this.props;

		if (!this.state.isEditing) {
			return (
				<pre className="message" style={styles.message}>{this.state.textFieldValue}</pre>
			);
		}

		const saveDisabled = this.state.errorText.length === 0;

		return (
			[
				<div key={`editor${reply.id}`} style={styles.editor}>
					<TextField
						key={`replyTextField${reply.id}`}
						hintText="Message"
						multiLine
						maxLength="2048"
						rowsMax={4}
						fullWidth
						defaultValue={this.state.textFieldValue}
						errorText={this.state.errorText}
						onChange={e => this.onChange(e)}
						style={styles.textField}
					/>
					<span style={styles.textFieldCoutner} key={`replyTextCounter${reply.id}`}>{2048 - this.state.textFieldValue.length} characters remaining</span>
				</div>,
				<div key={`editorActions${reply.id}`} style={styles.editorActions}>
					<FlatButton label="Cancel" onClick={() => this.closeEdit()} />
					<FlatButton label="Save" primary={saveDisabled} disabled={!saveDisabled} onClick={this.save} />
				</div>,
			]
		);
	}

	// Open answer text editor
	openEdit = () => {
		this.setState({ isEditing: true });
	}

	// Close answer text editor
	closeEdit = () => {
		this.setState({
			isEditing: false,
			textFieldValue: this.props.reply.message,
			errorText: '',
		});
	}

	// Controll answer text change
	onChange = (e) => {
		if (e.target.value.length == 0) {
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

	// Save edited answer text
	save = () => {
		const { reply } = this.props;
		this.setState({ isEditing: false });
		this.props.editPostInternal(reply, this.state.textFieldValue);
	}

	render() {
		const { reply } = this.props;
		return (
			<div className="reply" key={reply.id} style={(reply.isAccepted && !this.state.isEditing) ? [ styles.reply.base, styles.reply.accepted ] : styles.reply.base}>
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="stats" style={styles.stats}>
						<IconButton className="upvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => { this.props.votePost(reply, 1); }}>
							<ThumbUp color={reply.vote === 1 ? blueGrey500 : grey500} />
						</IconButton>
						<Likes votes={reply.votes} getLikes={this.getLikes} />
						<IconButton className="downvote" style={styles.vote.button.base} iconStyle={styles.vote.button.icon} onClick={() => { this.props.votePost(reply, -1); }}>
							<ThumbDown color={reply.vote === -1 ? blueGrey500 : grey500} />
						</IconButton>
					</div>
					<div className="details" style={!this.state.isEditing ? styles.details.base : [ styles.details.base, styles.details.editing ]}>{this.getEditableArea()}</div>
					{
						!this.state.isEditing &&
						<IconMenu
							iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
							anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
							targetOrigin={{ horizontal: 'right', vertical: 'top' }}
						>
							{
								reply.userID === this.props.userId ?
									[ <MenuItem primaryText="Edit" key={`edit${reply.id}`} onClick={this.openEdit} />,
										<MenuItem primaryText="Delete" key={`remove${reply.id}`} onClick={() => { this.props.remove(reply); }} /> ]
									:
									<MenuItem primaryText="Report" key={`report${reply.id}`} />
							}
						</IconMenu>
					}
				</div>
				{
					!this.state.isEditing &&
					<div className="additional-details" style={styles.additionalDetails}>
						{
							this.props.isUsersQuestion ?
								<IconButton className="follow" style={styles.bestAnswerButton.base} iconStyle={styles.bestAnswerButton.icon} onClick={() => this.props.toggleAcceptedAnswerInternal(reply.id, reply.isAccepted)}>
									<AcceptedIcon color={reply.isAccepted ? lightGreen500 : grey500} />
								</IconButton>
								:
								reply.isAccepted &&
								<AcceptedIcon
									color={lightGreen500}
									style={getStyles(styles.bestAnswerButton.icon, styles.bestAnswerButton.margin)}
								/>
						}
						<DiscussAuthor date={reply.date} userID={reply.userID} userName={reply.userName} />
					</div>
				}
			</div>
		);
	}
}

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	editPostInternal,
	toggleAcceptedAnswerInternal,
	getLikes: getLikesInternal(2),
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Reply));
