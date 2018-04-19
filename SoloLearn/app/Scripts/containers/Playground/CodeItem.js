// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

// Material UI components
import CommentsIcon from 'material-ui/svg-icons/communication/comment';
import Thumbs from 'material-ui/svg-icons/action/thumbs-up-down';
import LockIcon from 'material-ui/svg-icons/action/lock';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

// Utils
import { numberFormatter, updateDate } from 'utils';
import ProfileAvatar from 'components/Shared/ProfileAvatar';
import LanguageIcon from 'components/Shared/LanguageIcon';

const styles = {
	code: {
		display: 'flex',
		textDecoration: 'none',
		color: 'inherit',
		padding: '10px',
		borderBottom: '1px solid #f3f3f3',
	},

	detailsWrapper: {
		flex: '2 auto',
	},

	title: {
		fontSize: '14px',
		color: '#2b2b2b',
		margin: '0 0 3px 0',
	},

	date: {
		fontSize: '13px',
		color: '#777',
		margin: '0 0 5px',
	},

	stats: {
		margin: '5px 0 0 0',
		display: 'flex',
		alignItems: 'center',
		justifyContent: 'space-between',
	},

	mainStats: {
		display: 'inline-flex',
		alignItems: 'center',
	},

	comments: {
		base: {
			margin: '0 0 0 10px',
		},

		text: {
			verticalAlign: 'middle',
			color: '#5a5a5a',
			fontSize: '14px',
			margin: '0 7px 0 0',
		},

		icon: {
			verticalAlign: 'middle',
			width: '16px',
			height: '16px',
		},
	},

	lock: {
		verticalAlign: 'middle',
		width: '16px',
		height: '16px',
		marginLeft: 7,
	},

	vote: {
		button: {
			verticalAlign: 'middle',
			width: '16px',
			height: '16px',
		},

		text: {
			verticalAlign: 'middle',
			margin: '0 5px',
			minWidth: '23px',
			textAlign: 'center',
			color: '#5a5a5a',
			fontSize: '14px',
		},
	},

	authorDetails: {
		fontSize: '12px',
	},
};

class CodeItem extends Component {
	shouldComponentUpdate(nextProps) {
		return this.props.code !== nextProps.code;
	}
	render() {
		const { code } = this.props;
		const dateModified = updateDate(code.modifiedDate);
		return (
			<Link className="code" style={styles.code} to={`/playground/${code.publicID}`}>
				<LanguageIcon language={code.language} />
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="details">
						<p className="title" style={styles.title}>{code.name}</p>
						<div className="stats" style={styles.stats}>
							<div style={styles.mainStats}>
								<div className="votes">
									<Thumbs className="upvote" style={styles.vote.button} color={code.vote === 1 ? blueGrey500 : grey500} />
									<span style={styles.vote.text}>{code.votes > 0 ? `+${numberFormatter(code.votes)}` : numberFormatter(code.votes)}</span>
								</div>
								<div className="comments" style={styles.comments.base}>
									<CommentsIcon style={styles.comments.icon} color={grey500} />
									<span style={styles.comments.text}>{code.comments}</span>
								</div>
								<div>
									{ !code.isPublic &&
										<LockIcon style={styles.lock} color={grey500} />
									}
								</div>
							</div>
							<div className="author-details" style={styles.authorDetails}>
								<ProfileAvatar
									reversedOrder
									withUserNameBox
									userID={code.userID}
									timePassed={dateModified}
									userName={code.userName}
									avatarUrl={code.avatarUrl}
								/>
							</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

export default Radium(CodeItem);
