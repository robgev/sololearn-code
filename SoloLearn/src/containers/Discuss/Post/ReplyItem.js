import React, { Fragment } from 'react';
import { observer } from 'mobx-react';
import { ListItem, HorizontalDivider, Container } from 'components/atoms';
import { Linkify } from 'components/molecules';
import { VoteActions, Mention } from 'components/organisms';
import Author from './Author';

const ReplyItem = ({ reply }) => (
	<Fragment>
		<ListItem>
			<Container className="post">
				<Container className="info">
					<Container className="toolbar">
						<Container className="votes">
							<VoteActions
								id={reply.id}
								type="post"
								vertical
								initialCount={reply.votes}
								initialVote={reply.vote}
							/>
						</Container>
					</Container>
					<Container className="question">
						<Container className="message">
							<Linkify>
								<Mention text={reply.message} />
							</Linkify>
						</Container>
					</Container>
					<Container className="options">
						options
					</Container>
				</Container>
				<Container className="user">
					<Author
						level={reply.level}
						badge={reply.badge}
						userID={reply.userID}
						avatarUrl={reply.avatarUrl}
						userName={reply.userName}
						date={reply.date}
					/>
				</Container>
			</Container>
		</ListItem>
		<HorizontalDivider />
	</Fragment>
);

export default observer(ReplyItem);
