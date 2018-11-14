import React, { Component, Fragment, createRef } from 'react';
import { observer } from 'mobx-react';
import { ListItem, HorizontalDivider, Container, FlexBox } from 'components/atoms';
import { RaisedButton } from 'components/molecules';
import { VoteActions, Mention, CountingMentionInput } from 'components/organisms';
import Options from './Options';
import Author from './Author';
import AcceptReply from './AcceptReply';

@observer
class ReplyItem extends Component {
	state = {
		isHighlighted: false,
		isEditing: false,
		isEditEnabled: true,
	}
	postContainer = createRef();
	editInput = createRef();

	highlight = () => {
		this.postContainer.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
		this.setState({ isHighlighted: true });
		this.unhighlight = setTimeout(() => {
			this.setState({ isHighlighted: false });
		}, 2000);
	}

	toggleEdit = () => {
		this.setState(s => ({ isEditing: !s.isEditing }));
	}

	setCanEdit = (isEditEnabled) => {
		this.setState({ isEditEnabled });
	}

	edit = () => {
		const message = this.editInput.current.popValue();
		this.props.editReply(message);
		this.toggleEdit();
	}

	componentWillUnmount() {
		if (this.unhighlight) {
			clearTimeout(this.unhighlight);
		}
	}

	render() {
		const {
			reply, deleteReply, onAccept, askerID,
		} = this.props;
		if (this.state.isEditing) {
			return (
				<FlexBox column className="editing-post">
					<CountingMentionInput
						getUsers={{ type: 'discuss', params: { postId: reply.id } }}
						initText={reply.message}
						ref={this.editInput}
						onSubmitEnabledChange={this.setCanEdit}
					/>
					<Container className="buttons">
						<RaisedButton
							className="cancel"
							onClick={this.toggleEdit}
						>
							Cancel
						</RaisedButton>
						<RaisedButton
							className="edit"
							onMouseDown={this.edit}
							disabled={!this.state.isEditEnabled}
						>
							Edit
						</RaisedButton>
					</Container>
				</FlexBox>
			);
		}
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
									editPost={this.toggleEdit}
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
