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
import DeletePopup from './DeletePopup';
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
											deletePost={this.openDeletePopup}
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
									onClose={this.closeReportPopup}
									itemId={post.id}
									itemType="post"
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
							</Container>
						)
				}
			</PaperContainer>
		);
	}
}

export default Question;
