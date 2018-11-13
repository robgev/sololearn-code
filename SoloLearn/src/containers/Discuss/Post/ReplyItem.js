import React, { Component, Fragment, createRef } from 'react';
import { observer } from 'mobx-react';
import { ListItem, HorizontalDivider, Container } from 'components/atoms';
import { VoteActions, Mention } from 'components/organisms';
import Options from './Options';
import Author from './Author';
import AcceptReply from './AcceptReply';

@observer
class ReplyItem extends Component {
	state = {
		isHighlighted: false,
	}
	postContainer = createRef();
	highlight = () => {
		this.postContainer.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.setState({ isHighlighted: true });
		this.unhighlight = setTimeout(() => {
			this.setState({ isHighlighted: false });
		}, 2000);
	}
	componentWillUnmount() {
		if (this.unhighlight) {
			clearTimeout(this.unhighlight);
		}
	}
	render() {
		const { reply, deleteReply, onAccept, askerID } = this.props;
		return (
			<Fragment>
				<ListItem>
					<Container
						ref={this.postContainer}
						className={`post ${this.state.isHighlighted ? 'animate-highlight' : ''} ${reply.isAccepted ? 'accepted' : ''}`}
					>
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
								<Container>
									<AcceptReply
										askerID={askerID}
										isAccepted={reply.isAccepted}
										onClick={onAccept}
									/>
								</Container>
							</Container>
							<Container className="question">
								<Container className="message">
									<Mention text={reply.message} />
								</Container>
							</Container>
							<Container className="options">
								<Options
									userID={reply.userID}
									deletePost={deleteReply}
								/>
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
	}
}

export default ReplyItem;
