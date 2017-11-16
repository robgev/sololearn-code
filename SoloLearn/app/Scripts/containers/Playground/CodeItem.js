// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';

// Material UI components
import CommentsIcon from 'material-ui/svg-icons/communication/comment';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

// Utils
import numberFormatter from 'utils/numberFormatter';
import getLanguageColor from 'utils/getLanguageColor';
import updateDate from 'utils/dateFormatter';

const styles = {
	code: {
		display: 'flex',
		textDecoration: 'none',
		color: 'inherit',
		padding: '10px',
		borderBottom: '1px solid #f3f3f3',
	},

	languageIcon: {
		display: 'inline-flex',
		width: '40px',
		height: '40px',
		alignItems: 'center',
		justifyContent: 'center',
		fontSize: '13px',
		color: '#fff',
		margin: '0px 10px 0 0',
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
		return (
			<Link className="code" style={styles.code} to={`/playground/${code.publicID}`}>
				<div className="language" style={[ styles.languageIcon, { backgroundColor: getLanguageColor(code.language) } ]}>{code.language}</div>
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="details">
						<p className="title" style={styles.title}>{code.name}</p>
						<p className="date" style={styles.date}>Last modified: {updateDate(code.modifiedDate)}</p>
						<div className="stats" style={styles.stats}>
							<div style={styles.mainStats}>
								<div className="votes">
									<ThumbUp className="upvote" style={styles.vote.button} color={code.vote === 1 ? blueGrey500 : grey500} />
									<span style={styles.vote.text}>{code.votes > 0 ? `+${numberFormatter(code.votes)}` : numberFormatter(code.votes)}</span>
									<ThumbDown className="downvote" style={styles.vote.button} color={code.vote === -1 ? blueGrey500 : grey500} />
								</div>
								<div className="comments" style={styles.comments.base}>
									<span style={styles.comments.text}>{code.comments}</span>
									<CommentsIcon style={styles.comments.icon} color={grey500} />
								</div>
							</div>
							<div className="author-details" style={styles.authorDetails}>
								<span>{code.userName}</span>
							</div>
						</div>
					</div>
				</div>
			</Link>
		);
	}
}

export default Radium(CodeItem);
