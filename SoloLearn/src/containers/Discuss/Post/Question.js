import React, { Component } from 'react';
import { browserHistory } from 'react-router';
import { observer } from 'mobx-react';
import { PaperContainer, Container, Title, IconButton, Loading, FlexBox } from 'components/atoms';
import { VoteActions, Mention } from 'components/organisms';
import { Follow } from 'components/icons';
import Author from './Author';
import Options from './Options';
import Tags from '../Tags';

@observer
class Question extends Component {
	editPost = () => {
		browserHistory.push(`/discuss/edit/${this.props.post.id}`);
	}
	render() {
		const {
			post, onVote, onDelete, onFollowClick,
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
											<IconButton active={post.isFollowing} onClick={onFollowClick}>
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
							</Container>
						)
				}
			</PaperContainer>
		);
	}
}

export default Question;
