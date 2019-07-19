import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import {
	PaperContainer,
	Container,
	Title,
	Loading,
	FlexBox,
	Snackbar,
	SecondaryTextBlock,
} from 'components/atoms';
import {
	ProfileAvatar,
	// ViewStats,
	UsernameLink,
	IconWithText,
} from 'components/molecules';
import {
	// VoteActions,
	Mention,
	FeedBottomBarFullStatistics,
} from 'components/organisms';
import {
	Follow,
	Edit as EditIcon,
} from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import PreviewItem from 'components/PreviewItem';
import { generatePreviews, updateDate } from 'utils';

import RemovalPopup from './RemovalPopup';
import DeletePopup from './DeletePopup';
import Options from './Options';
import Tags from '../Tags';
import QuestionEditor from '../QuestionEditor';

import { editQuestion } from '../discuss.api';

@translate()
@observer
class Question extends Component {
	state = {
		isFollowSnackbarOpen: false,
		isReportPopupOpen: false,
		isRemovalPopupOpen: false,
		isDeletePopupOpen: false,
		isEditMode: false,
		isFollowing: false,
	};
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
		const { isLoggedIn, toggleSigninPopup } = this.props;

		if (!isLoggedIn) {
			toggleSigninPopup();
		} else {
			this.setState({ isReportPopupOpen: true });
		}
	}
	closeFollowSnackbar = () => {
		this.setState({ isFollowSnackbarOpen: false });
	}
	onFollowClick = () => {
		const { isLoggedIn, toggleSigninPopup, onFollowClick } = this.props;

		if (!isLoggedIn) {
			toggleSigninPopup();
		} else {
			onFollowClick();
			this.setState({ isFollowSnackbarOpen: true });
		}
	}
	editPost = () => {
		this.setState({ isEditMode: true });
	}

	exitEditMode = () => {
		this.setState({ isEditMode: false });
	}

	handleEditQuestionSubmit = ({ title, message, tags }) => editQuestion({
		id: this.props.post.id, title, message, tags,
	})
		.then(({ post }) => {
			this.props.post.title = post.title;
			this.props.post.message = post.message;
			this.props.post.tags = post.tags;
		})
		.then(() => {
			this.exitEditMode();
		})

	render() {
		const {
			isFollowSnackbarOpen,
			isReportPopupOpen,
			isRemovalPopupOpen,
			isDeletePopupOpen,
			isEditMode,
		} = this.state;
		const {
			post, onDelete, t, toggleSigninPopup,
		} = this.props;
		const user = post !== null && {
			id: post.userID,
			avatarUrl: post.avatarUrl,
			name: post.userName,
			level: post.level,
		};

		return (
			<Container>
				{
					post === null
						? (
							<FlexBox className="loading-question" align justify>
								<Loading />
							</FlexBox>
						)
						: !isEditMode ? (
							<PaperContainer className="main-post">
								<FlexBox fullWidth className="post">
									<ProfileAvatar
										className="user-avatar"
										user={user}
									/>
									<FlexBox fullWidth column justifyBetween>
										<Container className="info">
											<Container className="question">
												<FlexBox className="title-and-options-container" justifyBetween fullWidth>
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
													<FlexBox className="options" justifyEnd align>
														<IconWithText className="follow-container" onClick={this.onFollowClick} Icon={Follow}>
															<SecondaryTextBlock className="follow-text">
																{post.isFollowing ? 'Unfollow' : 'Follow'}
															</SecondaryTextBlock>
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
													<FlexBox className="edit-message-container" align>
														<Container className="edit-message-icon" >
															<EditIcon />
														</Container>
														<SecondaryTextBlock className="edited-message">
															{t('discuss.edited-by-format').replace('()', post.modifyUserName)},
															{updateDate(post.modifyDate)}
														</SecondaryTextBlock>
													</FlexBox>
												}
												<Container className="tags">
													<Tags tags={post.tags} />
												</Container>
												<Container className="question-preview-container">
													{generatePreviews(post.message).map(preview => (
														<Container key={preview.link} className="preview">
															<PreviewItem
																{...preview}
															/>
														</Container>
													))}
												</Container>
												<FlexBox justifyBetween fullWidth align className="statistics-container">
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
														toggleSigninPopup={toggleSigninPopup}
													/>
													<SecondaryTextBlock className="statistics-date">{updateDate(post.date)} </SecondaryTextBlock>
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
							</PaperContainer>
						)
							:
							<QuestionEditor
								isNew={false}
								post={post}
								handleCancel={this.exitEditMode}
								submit={this.handleEditQuestionSubmit}
							/>
				}
			</Container>
		);
	}
}

export default Question;
