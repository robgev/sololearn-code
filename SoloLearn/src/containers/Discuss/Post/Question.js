import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import {
	PaperContainer, Container, Title,
	IconButton, Loading, FlexBox, Snackbar, SecondaryTextBlock,
} from 'components/atoms';
import { ProfileAvatar, ViewStats, UsernameLink, IconWithText } from 'components/molecules';
import { VoteActions, Mention, FeedBottomBarFullStatistics } from 'components/organisms';
import { Follow } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import RemovalPopup from './RemovalPopup';
import DeletePopup from './DeletePopup';
import Options from './Options';
import Tags from '../Tags';
import { updateDate } from 'utils';

@translate()
@observer
class Question extends Component {
	state = {
		isFollowSnackbarOpen: false,
		isReportPopupOpen: false,
		isRemovalPopupOpen: false,
		isDeletePopupOpen: false,
	}
	openDeletePopup = () => {
		this.setState({ isDeletePopupOpen: true });
	}
	closeDeletePopup = () => {
		this.setState({ isDeletePopupOpen: false });
	}
	openRemovalPopup = () => {
		this.setState({ isRemovalPopupOpen: true });
	}
	closeRemovalPopup = () => {
		this.setState({ isRemovalPopupOpen: false });
	}
	closeReportPopup = () => {
		this.setState({ isReportPopupOpen: false });
	}
	openReportPopup = () => {
		this.setState({ isReportPopupOpen: true });
	}
	closeFollowSnackbar = () => {
		this.setState({ isFollowSnackbarOpen: false });
	}
	onFollowClick = () => {
		this.props.onFollowClick();
		this.setState({ isFollowSnackbarOpen: true });
	}
	editPost = () => {
		browserHistory.push(`/discuss/edit/${this.props.post.id}`);
	}
	render() {
		const {
			isFollowSnackbarOpen, isReportPopupOpen, isRemovalPopupOpen, isDeletePopupOpen,
		} = this.state;
		const {
			post, onDelete, t,
		} = this.props;
		const user = post !== null && {
			id: post.userID,
			avatarUrl: post.avatarUrl,
			name: post.userName,
			level: post.level,
		};

		return (
			<PaperContainer className="main-post">
				{
					post === null
						? (
							<FlexBox className="loading-question" align justify>
								<Loading />
							</FlexBox>
						)
						: (
							<FlexBox fullWidth className="post">
								<ProfileAvatar
									className="user-avatar"
									user={user}
								/>
								<FlexBox fullWidth column justifyBetween>
									<Container className="info">
										<Container className="question">
											<FlexBox justifyBetween fullWidth>
												<Container>
													<Container className="title">
														<Title className="title-content">
															{post.title}
														</Title>
													</Container>
													<FlexBox align className="author">
														<UsernameLink className="author-name" to={`/profile/${post.userID}`}>{post.userName}</UsernameLink>
													</FlexBox>
												</Container>
												<FlexBox className="options" justifyEnd>
													<IconWithText className="follow" Icon={Follow}>
														Follow
													</IconWithText>
													<Options
														userID={post.userID}
														deletePost={this.openDeletePopup}
														editPost={this.editPost}
														reportPost={this.openReportPopup}
														requestRemoval={this.openRemovalPopup}
													/>
												</FlexBox>
											</FlexBox>
											<Container className="message">
												<Mention text={post.message} />
											</Container>
											{
												post.modifyDate && post.modifyUserID && post.modifyUserName &&
												<SecondaryTextBlock className="edit-message">
													{t('discuss.edited-by-format').replace('()', post.modifyUserName)},
													{updateDate(post.modifyDate)}
												</SecondaryTextBlock>
											}
											<Container className="tags">
												<Tags tags={post.tags} />
											</Container>
											<FlexBox justifyBetween alignEnd fullWidth>
												<FeedBottomBarFullStatistics
													id={post.id}
													key={post.id}
													date={post.date}
													views={post.viewCount}
													userVote={post.vote}
													type="post"
													withDate={false}
													totalVotes={post.votes}
													// onChange={onChange}
													comments={post.answers}
													// className="up-feed-item-bottom-bar"
												/>
												<SecondaryTextBlock className="text">{updateDate(post.date)} </SecondaryTextBlock>
											</FlexBox>
										</Container>
									</Container>
								</FlexBox>
								<Snackbar
									onClose={this.closeFollowSnackbar}
									open={isFollowSnackbarOpen}
									message={post.isFollowing ? t('discuss.following-title') : t('discuss.not-following-title')}
								/>
								<ReportPopup
									open={isReportPopupOpen}
									onClose={this.closeReportPopup}
									itemId={post.id}
									itemType={2}
								/>
								<RemovalPopup
									open={isRemovalPopupOpen}
									id={post.id}
									deletePost={onDelete}
									onClose={this.closeRemovalPopup}
								/>
								<DeletePopup
									open={isDeletePopupOpen}
									onClose={this.closeDeletePopup}
									onDelete={onDelete}
								/>
							</FlexBox>
						)
				}
			</PaperContainer>
		);
	}
}

export default Question;
