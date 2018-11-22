import React, { Component } from 'react';
import { translate } from 'react-i18next';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import {
	PaperContainer, Container, Title,
	IconButton, Loading, FlexBox, Snackbar,
} from 'components/atoms';
import { VoteActions, Mention } from 'components/organisms';
import { Follow } from 'components/icons';
import ReportPopup from 'components/ReportPopup';
import RemovalPopup from './RemovalPopup';
import Author from './Author';
import Options from './Options';
import Tags from '../Tags';

@translate()
@observer
class Question extends Component {
	state = {
		isFollowSnackbarOpen: false,
		isReportPopupOpen: false,
		isRemovalPopupOpen: false,
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
		const { isFollowSnackbarOpen, isReportPopupOpen, isRemovalPopupOpen } = this.state;
		const {
			post, onVote, onDelete, t,
		} = this.props;
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
							<Container className="post">
								<Container className="info">
									<Container className="toolbar">
										<Container className="votes">
											<VoteActions
												id={post.id}
												type="post"
												vertical
												initialCount={post.votes}
												initialVote={post.vote}
												onChange={onVote}
											/>
										</Container>
										<Container className="follow">
											<IconButton active={post.isFollowing} onClick={this.onFollowClick}>
												<Follow />
											</IconButton>
										</Container>
									</Container>
									<Container className="question">
										<Container className="title">
											<Title>
												{post.title}
											</Title>
										</Container>
										<Container className="tags">
											<Tags tags={post.tags} />
										</Container>
										<Container className="message">
											<Mention text={post.message} />
										</Container>
									</Container>
									<Container className="options">
										<Options
											userID={post.userID}
											deletePost={onDelete}
											editPost={this.editPost}
											reportPost={this.openReportPopup}
											requestRemoval={this.openRemovalPopup}
										/>
									</Container>
								</Container>
								<Container className="user">
									<Author
										badge={post.badge}
										userID={post.userID}
										avatarUrl={post.avatarUrl}
										userName={post.userName}
										date={post.date}
									/>
								</Container>
								<Snackbar
									onClose={this.closeFollowSnackbar}
									open={isFollowSnackbarOpen}
									message={post.isFollowing ? t('discuss.following-title') : t('discuss.not-following-title')}
								/>
								<ReportPopup
									open={isReportPopupOpen}
									onRequestClose={this.closeReportPopup}
									itemId={post.id}
									itemType="post"
								/>
								<RemovalPopup
									open={isRemovalPopupOpen}
									id={post.id}
									deletePost={this.onDelete}
									onClose={this.closeRemovalPopup}
								/>
							</Container>
						)
				}
			</PaperContainer>
		);
	}
}

export default Question;
