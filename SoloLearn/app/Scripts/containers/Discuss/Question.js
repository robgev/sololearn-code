// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import FollowIcon from 'material-ui/svg-icons/toggle/star';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

// Redux modules
import { questionFollowingInternal } from '../../actions/discuss';
import getLikesInternal from '../../actions/likes';

import DiscussTag from './DiscussTag';
import DiscussAuthor from './DiscussAuthor';

// Utils
import Likes from '../../components/Shared/Likes';
import removeDups from '../../utils/removeDups';

const styles = {
	question: {
		padding: '10px',
		borderBottom: '1px solid #f3f3f3',
		overflow: 'hidden',
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
		overflow: 'hidden',
		margin: '7px 0px 0px 10px',
		width: '90%',
	},

	title: {
		fontSize: '15px',
		color: '#636060',
		margin: '0 0 5px 0',
	},

	tags: {

	},

	tag: {
		base: {
			display: 'inline-block',
			verticalAlign: 'middle',
			backgroundColor: '#9CCC65',
			color: '#fff',
			fontSize: '12px',
			padding: '3px 5px',
			borderRadius: '3px',
		},

		margin: {
			margin: '0 0 0 5px',
		},
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

	followButton: {
		base: {
			width: '40px',
			height: '40px',
			padding: '10px',
		},

		icon: {
			width: '20px',
			height: '20px',
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
};

class Question extends Component {
	getLikes = () => {
		this.props.getLikes(this.props.question.id);
	}
	render() {
		const { question } = this.props;

		return (
			<Paper className="question" key={question.id} style={styles.question}>
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="stats" style={styles.stats}>
						<IconButton
							className="upvote"
							style={styles.vote.button.base}
							iconStyle={styles.vote.button.icon}
							onClick={() => { this.props.votePost(question, 1); }}
						>
							<ThumbUp color={question.vote === 1 ? blueGrey500 : grey500} />
						</IconButton>
						<Likes votes={question.votes} getLikes={this.getLikes} />
						<IconButton
							className="downvote"
							style={styles.vote.button.base}
							iconStyle={styles.vote.button.icon}
							onClick={() => { this.props.votePost(question, -1); }}
						>
							<ThumbDown color={question.vote === -1 ? blueGrey500 : grey500} />
						</IconButton>
					</div>
					<div className="details" style={styles.details}>
						<p className="title" style={styles.title}>{question.title}</p>
						<div className="tags">
							{
								removeDups(question.tags).map((tag, index) =>
									<DiscussTag tag={tag} index={index} key={tag} />)
							}
						</div>
						<pre className="message" style={styles.message}>{question.message}</pre>
					</div>
					<IconMenu
						iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
						anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
						targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					>
						{
							question.userID === this.props.userId ?
								[
									<MenuItem
										primaryText="Edit"
										key={`edit${question.id}`}
										containerElement={<Link to={`/discuss/edit/${question.id}`} />}
									/>,
									<MenuItem
										primaryText="Delete"
										key={`remove${question.id}`}
										onClick={() => { this.props.remove(question); }}
									/>,
								]
								:
								<MenuItem primaryText="Report" key={`report${question.id}`} />
						}
					</IconMenu>
				</div>
				<div className="additional-details" style={styles.additionalDetails}>
					<IconButton
						className="follow"
						style={styles.followButton.base}
						iconStyle={styles.followButton.icon}
						onClick={() => {
							this.props.questionFollowingInternal(question.id, !question.isFollowing);
						}}
					>
						<FollowIcon color={question.isFollowing ? blueGrey500 : grey500} />
					</IconButton>
					<DiscussAuthor
						date={question.date}
						userID={question.userID}
						userName={question.userName}
					/>
				</div>
			</Paper>
		);
	}
}

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	questionFollowingInternal, getLikes: getLikesInternal(2),
};

export default connect(mapStateToProps, mapDispatchToProps)(Radium(Question));
