// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';

// Material UI components
import { Paper, IconButton, IconMenu, MenuItem } from 'material-ui';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import FollowIcon from 'material-ui/svg-icons/toggle/star';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

// Utils
import Likes from 'components/Shared/Likes';
import PostedDate from 'components/Shared/PostedDate';
import { removeDups, updateDate } from 'utils';

// Redux modules
import { questionFollowingInternal } from 'actions/discuss';
import getLikesInternal from 'actions/likes';

import DiscussAuthor from 'components/Shared/ProfileAvatar';
import DiscussTag from './DiscussTag';

import { QuestionStyles as styles } from './styles';

const mapStateToProps = state => ({ userId: state.userProfile.id });

const mapDispatchToProps = {
	questionFollowingInternal, getLikes: getLikesInternal(2),
};

@connect(mapStateToProps, mapDispatchToProps)
@Radium
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
						withUserNameBox
						date={question.date}
						userID={question.userID}
						avatarUrl={question.avatarUrl}
						userName={question.userName}
					/>
					<PostedDate date={question.date} style={{ float: 'right' }} />
				</div>
			</Paper>
		);
	}
}

export default Question;
