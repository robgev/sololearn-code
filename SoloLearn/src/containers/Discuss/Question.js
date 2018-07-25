// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import Radium from 'radium';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Linkify from 'react-linkify';

// Material UI components
import { Paper, IconButton, IconMenu, MenuItem } from 'material-ui';
import Snackbar from 'material-ui/Snackbar';
import ThumbUp from 'material-ui/svg-icons/action/thumb-up';
import ThumbDown from 'material-ui/svg-icons/action/thumb-down';
import FollowIcon from 'material-ui/svg-icons/toggle/star';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

// Utils
import Likes from 'components/Likes';
import PreviewItem from 'components/PreviewItem';
import ReportPopup from 'components/ReportPopup';
import DiscussAuthor from 'components/ProfileAvatar';
import ReportItemTypes from 'constants/ReportItemTypes';
import {
	updateDate,
	removeDups,
	replaceMention,
	generatePreviews,
	determineAccessLevel,
} from 'utils';

// Redux modules
import { questionFollowingInternal } from 'actions/discuss';
import getLikesAndDownvotesCurried from 'actions/likes';

import DiscussTag from 'components/Questions/DiscussTag';
import RemovalPopup from './RemovalPopup';

import { QuestionStyles as styles } from './styles';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	questionFollowingInternal,
	getLikes: getLikesAndDownvotesCurried('postLikes'),
	getDownvotes: getLikesAndDownvotesCurried('postDownvotes'),
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
@Radium
class Question extends Component {
	state = {
		reportPopupOpen: false,
		removalPopupOpen: false,
		followSnackbarOpen: false,
	}

	getLikes = () => this.props.getLikes(this.props.question.id);

	getDownvotes = () => this.props.getDownvotes(this.props.question.id);

	toggleRemovalPopup = () => {
		const { removalPopupOpen } = this.state;
		this.setState({ removalPopupOpen: !removalPopupOpen });
	}

	toggleReportPopup = () => {
		const { reportPopupOpen } = this.state;
		this.setState({ reportPopupOpen: !reportPopupOpen });
	}

	handleFollowing = () => {
		const { question } = this.props;
		this.props.questionFollowingInternal(question.id, !question.isFollowing);
		this.setState({ followSnackbarOpen: true });
	}

	handleSnackbarClose = () => {
		this.setState({ followSnackbarOpen: false });
	}

	render() {
		const { removalPopupOpen, reportPopupOpen, followSnackbarOpen } = this.state;
		const { question, accessLevel, t } = this.props;
		const previewsData = generatePreviews(question.message);

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
						<Likes
							votes={question.votes}
							getLikes={this.getLikes}
							accessLevel={accessLevel}
							getDownvotes={this.getDownvotes}
						/>
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
						<pre className="message" style={styles.message}>
							<Linkify>
								{replaceMention(question.message)}
							</Linkify>
						</pre>
						{previewsData.map(singlePreviewData => (
							<PreviewItem
								{...singlePreviewData}
								key={singlePreviewData.link}
							/>
						))}
					</div>
					<IconMenu
						iconButtonElement={<IconButton><MoreVertIcon /></IconButton>}
						anchorOrigin={{ horizontal: 'right', vertical: 'top' }}
						targetOrigin={{ horizontal: 'right', vertical: 'top' }}
					>
						{question.userID === this.props.userId &&
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
						{question.userID !== this.props.userId &&
							accessLevel > 1 &&
							<MenuItem
								primaryText={t('common.edit-action-title')}
								key={`edit${question.id}`}
								containerElement={<Link to={`/discuss/edit/${question.id}`} />}
							/>
						}
						{question.userID !== this.props.userId &&
							accessLevel > 0 &&
							<MenuItem
								onClick={this.toggleRemovalPopup}
								primaryText={accessLevel === 1 ?
									t('discuss.forum_request_removal_prompt_title') :
									t('discuss.forum_remove_prompt_title')
								}
							/>
						}
						{question.userID !== this.props.userId &&
							<MenuItem
								primaryText={t('common.report-action-title')}
								onClick={this.toggleReportPopup}
							/>
						}
					</IconMenu>
				</div>
				<div className="additional-details" style={styles.additionalDetails}>
					<IconButton
						className="follow"
						style={styles.followButton.base}
						iconStyle={styles.followButton.icon}
						onClick={this.handleFollowing}
					>
						<FollowIcon color={question.isFollowing ? blueGrey500 : grey500} />
					</IconButton>
					<DiscussAuthor
						withTooltip
						reversedOrder
						withUserNameBox
						level={question.level}
						badge={question.badge}
						userID={question.userID}
						avatarUrl={question.avatarUrl}
						userName={question.userName}
						tooltipId={`question-${question.id}`}
						timePassed={updateDate(question.date)}
					/>
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
					accessLevel={accessLevel}
					onRequestClose={this.toggleRemovalPopup}
				/>
				<Snackbar
					autoHideDuration={1500}
					open={followSnackbarOpen}
					onRequestClose={this.handleSnackbarClose}
					message={question.isFollowing ? t('discuss.following-title') : t('discuss.not-following-title')}
				/>
			</Paper>
		);
	}
}

export default Question;