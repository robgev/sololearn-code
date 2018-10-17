// React modules
import React, { Component } from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import Linkify from 'react-linkify';

// Material UI components
import Paper from 'material-ui/Paper';
import IconButton from 'material-ui/IconButton';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import Snackbar from 'material-ui/Snackbar';
import ArrowUp from 'material-ui/svg-icons/hardware/keyboard-arrow-up';
import ArrowDown from 'material-ui/svg-icons/hardware/keyboard-arrow-down';
import FollowIcon from 'material-ui/svg-icons/toggle/star';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import { grey500, blueGrey500 } from 'material-ui/styles/colors';

// Utils
import Likes from 'components/Likes';
import PreviewItem from 'components/PreviewItem';
import ReportPopup from 'components/ReportPopup';
import DiscussAuthor from 'components/ProfileAvatar';
import ReportItemTypes from 'constants/ReportItemTypes';
import UserTooltip from 'components/UserTooltip';
import {
	updateDate,
	replaceMention,
	generatePreviews,
	determineAccessLevel,
} from 'utils';

// Redux modules
import { questionFollowingInternal } from 'actions/discuss';

import DiscussTags from 'components/Questions/DiscussTags';
import RemovalPopup from './RemovalPopup';

import { QuestionStyles as styles } from './styles';

const mapStateToProps = state => ({
	userId: state.userProfile.id,
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const mapDispatchToProps = {
	questionFollowingInternal,
};

@connect(mapStateToProps, mapDispatchToProps)
@translate()
class Question extends Component {
	state = {
		reportPopupOpen: false,
		removalPopupOpen: false,
		followSnackbarOpen: false,
		acceptedAnswerSnackbarOpen: false,
	}

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
		const {
			reportPopupOpen,
			removalPopupOpen,
			followSnackbarOpen,
		} = this.state;
		const { question, accessLevel, t } = this.props;
		const previewsData = generatePreviews(question.message);

		return (
			<Paper className="question" key={question.id} style={styles.question}>
				<div className="details-wrapper" style={styles.detailsWrapper}>
					<div className="stats" style={styles.stats}>
						<IconButton
							style={styles.vote.button.base}
							iconStyle={styles.vote.button.icon}
							className="upvote hoverable-icon"
							onClick={() => { this.props.votePost(question, 1); }}
						>
							<ArrowUp color={question.vote === 1 ? blueGrey500 : grey500} />
						</IconButton>
						<Likes
							votes={question.votes}
							type="post"
							id={question.id}
						/>
						<IconButton
							style={styles.vote.button.base}
							iconStyle={styles.vote.button.icon}
							className="downvote hoverable-icon"
							onClick={() => { this.props.votePost(question, -1); }}
						>
							<ArrowDown color={question.vote === -1 ? blueGrey500 : grey500} />
						</IconButton>
						<IconButton
							className="follow hoverable-icon"
							style={styles.followButton.base}
							menuStyle={{ width: 100 }}
							iconStyle={styles.followButton.icon}
							onClick={this.handleFollowing}
						>
							<FollowIcon color={question.isFollowing ? blueGrey500 : grey500} />
						</IconButton>
					</div>
					<div className="details" style={styles.details}>
						<p className="title" style={styles.title}>{question.title}</p>
						<DiscussTags tags={question.tags} />
						<pre className="message" style={styles.message}>
							<Linkify>
								<div style={{ overflowWrap: 'break-word' }}>
									{replaceMention(question.message)}
								</div>
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
						iconButtonElement={<IconButton><MoreVertIcon color={grey500} /></IconButton>}
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
					<UserTooltip style={{ marginLeft: 'auto' }} userData={question}>
						<DiscussAuthor
							reversedOrder
							withUserNameBox
							level={question.level}
							badge={question.badge}
							userID={question.userID}
							avatarUrl={question.avatarUrl}
							userName={question.userName}
							timePassed={updateDate(question.date)}
						/>
					</UserTooltip>
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
