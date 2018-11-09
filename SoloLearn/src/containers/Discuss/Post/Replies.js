import React, { Component } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { observer } from 'mobx-react';
import { Container, List, PaperContainer, SecondaryTextBlock, Select, MenuItem } from 'components/atoms';
import { InfiniteScroll } from 'components/molecules';
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
	addReplyInput = React.createRef();

	replies = new IReplies({
		postID: this.props.postID,
		findPostID: this.props.replyID,
		userInfo: this.props.userInfo,
	});

	componentWillUnmount() {
		this.replies.dispose();
	}

	onOrderChange = (e) => {
		this.replies.setOrderBy(e.target.value);
	}

	render() {
		const { count, t } = this.props;
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
							<MenuItem value={IReplies.ORDER_BY_VOTE}>Vote</MenuItem>
							<MenuItem value={IReplies.ORDER_BY_DATE}>Date</MenuItem>
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
							submit={this.replies.addReply}
						/>
						<List>
							{
								this.replies.entities.map(reply => (
									<ReplyItem key={reply.id} reply={reply} />
								))
							}
						</List>
					</PaperContainer>
				</InfiniteScroll>
			</Container>
		);
	}
}

export default Replies;
