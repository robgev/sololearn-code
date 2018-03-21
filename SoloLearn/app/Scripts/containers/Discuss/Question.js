// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';

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
import ReportPopup from 'components/Shared/ReportPopup';
import DiscussAuthor from 'components/Shared/ProfileAvatar';
import ReportItemTypes from 'constants/ReportItemTypes';
import { removeDups, determineAccessLevel } from 'utils';

// Redux modules
import { questionFollowingInternal } from 'actions/discuss';
import getLikesInternal from 'actions/likes';

import RemovalPopup from './RemovalPopup';
import DiscussTag from './DiscussTag';

import { QuestionStyles as styles } from './styles';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: state.userProfile.accessLevel,
});

const mapDispatchToProps = {
	questionFollowingInternal, getLikes: getLikesInternal(2),
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
@Radium
class Question extends Component {
	state = {
		reportPopupOpen: false,
		removalPopupOpen: false,
	}

	getLikes = () => {
		this.props.getLikes(this.props.question.id);
	}

	toggleRemovalPopup = () => {
		const { removalPopupOpen } = this.state;
		this.setState({ removalPopupOpen: !removalPopupOpen });
	}

	toggleReportPopup = () => {
		const { reportPopupOpen } = this.state;
		this.setState({ reportPopupOpen: !reportPopupOpen });
	}

	render() {
		const { removalPopupOpen, reportPopupOpen } = this.state;
		const { question, accessLevel, t } = this.props;
		const determinedAccessLevel = determineAccessLevel(accessLevel);

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
						{		question.userID === this.props.userId &&
							[
								<MenuItem
									primaryText={t('common.edit-action-title')}
									key={`edit${question.id}`}
									containerElement={<Link to={`/discuss/edit/${question.id}`} />}
								/>,
								<MenuItem
									primaryText={t('common.delete-title')}
									key={`remove${question.id}`}
									onClick={() => { this.props.remove(question); }}
								/>,
							]
						}
						{ question.userID !== this.props.userId &&
							<MenuItem
								primaryText={t('common.report-action-title')}
								onClick={this.toggleReportPopup}
							/>
						}
						{ question.userID !== this.props.userId &&
							determinedAccessLevel > 0 &&
							<MenuItem
								onClick={this.toggleRemovalPopup}
								primaryText={determinedAccessLevel === 1 ?
									t('discuss.forum_request_removal_prompt_title') :
									t('discuss.forum_remove_prompt_title')
								}
							/>
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
				<ReportPopup
					itemId={question.id}
					open={reportPopupOpen}
					itemType={ReportItemTypes.post}
					onRequestClose={this.toggleReportPopup}
				/>
				<RemovalPopup
					post={question}
					open={removalPopupOpen}
					removedItemId={question.id}
					itemType={ReportItemTypes.post}
					accessLevel={determinedAccessLevel}
					onRequestClose={this.toggleRemovalPopup}
				/>
			</Paper>
		);
	}
}

export default Question;
