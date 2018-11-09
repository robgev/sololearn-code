import React, { Component } from 'react';
import { observer } from 'mobx-react';
import { PaperContainer, Container, Title, IconButton, Loading } from 'components/atoms';
import { Linkify } from 'components/molecules';
import { VoteActions, Mention } from 'components/organisms';
import { Follow } from 'components/icons';
import Author from './Author';
import Tags from '../Tags';

@observer
class Question extends Component {
	render() {
		const { post, onFollowClick } = this.props;
		return (
			<PaperContainer className="main-post">
				{
					post === null
						? <Loading />
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
											<Linkify>
												<Mention text={post.message} />
											</Linkify>
										</Container>
									</Container>
									<Container className="options">
										options
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
