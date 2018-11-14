import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import {
	Container, List, PaperContainer,
	SecondaryTextBlock, Select, MenuItem,
	FlexBox, TextBlock,
} from 'components/atoms';
import { InfiniteScroll, RaisedButton } from 'components/molecules';
import AddReply from './AddReply';
import ReplyItem from './ReplyItem';
import IReplies from './IReplies';

const mapStateToProps = ({ userProfile }) => ({
	userInfo: { userName: userProfile.name, avatarUrl: userProfile.avatarUrl },
});

@connect(mapStateToProps)
@translate()
@observer
class Replies extends Component {
	repliesRefs = {}
	addReplyInput = React.createRef();

	replies = new IReplies({
		postID: this.props.postID,
		userInfo: this.props.userInfo,
	});

	componentDidMount() {
		const { replyID } = this.props;
		if (replyID === null) {
			this.replies.initial({ findPostID: null });
		} else {
			this.replies.initial({ findPostID: replyID })
				.then(() => {
					this.highlight(replyID);
				});
		}
	}

	highlight = (replyID) => {
		if (this.repliesRefs[replyID]) {
			this.repliesRefs[replyID].highlight();
		}
	}

	addReply = (message) => {
		this.replies.addReply(message)
			.then((id) => {
				this.highlight(id);
				this.props.onCountChange(1);
			});
	}

	deleteReply = (id) => {
		this.replies.deleteReply(id)
			.then(() => {
				this.props.onCountChange(-1);
			});
	}

	componentWillUnmount() {
		this.replies.dispose();
	}

	onOrderChange = (e) => {
		this.replies.setOrderBy(e.target.value);
	}

	render() {
		const { count, t, askerID } = this.props;
		return (
			<Container className="replies">
				<Container className="replies-toolbar">
					<SecondaryTextBlock>
						{count} {t(count === 1 ? 'discuss.answer-one-format' : 'discuss.answer-other-format')}
					</SecondaryTextBlock>
					<Container>
						<Select
							value={this.replies.orderBy}
							onChange={this.onOrderChange}
						>
							<MenuItem value={IReplies.ORDER_BY_VOTE}>{t('discuss.answers.filter.vote')}</MenuItem>
							<MenuItem value={IReplies.ORDER_BY_DATE}>{t('discuss.answers.filter.date')}</MenuItem>
						</Select>
					</Container>
				</Container>
				<InfiniteScroll
					hasMore={this.replies.hasMore}
					loadMore={this.replies.getReplies}
					initialLoad={false}
					isLoading={this.replies.isFetching}
				>
					<PaperContainer>
						<AddReply
							postID={this.props.postID}
							submit={this.addReply}
						/>
						{this.replies.canLoadAbove
							? <RaisedButton onClick={this.replies.getRepliesAbove}>Load above</RaisedButton>
							: null
						}
						{this.replies.entities.length !== 0 || this.replies.isFetching
							? (
								<List>
									{
										this.replies.entities.map(reply => (
											<ReplyItem
												ref={(replyView) => {
													this.repliesRefs[reply.id] = replyView;
												}}
												editReply={this.replies.editReply(reply.id)}
												askerID={askerID}
												key={reply.id}
												reply={reply}
												deleteReply={() => this.deleteReply(reply.id)}
												onAccept={() => this.replies.onAcceptReply(reply.id)}
											/>
										))
									}
								</List>
							)
							: (
								<FlexBox justify align className="empty-card-placeholder">
									<TextBlock>{t('common.empty-list-message')}</TextBlock>
								</FlexBox>
							)
						}
					</PaperContainer>
				</InfiniteScroll>
			</Container>
		);
	}
}

export default Replies;
