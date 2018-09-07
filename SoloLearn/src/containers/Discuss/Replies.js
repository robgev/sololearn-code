// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';
import InfiniteScroll from 'react-infinite-scroller';

import { determineAccessLevel } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';
import ReportPopup from 'components/ReportPopup';
// import InfiniteVirtualizedList from 'components/InfiniteVirtualizedList';

// Additional components
import Reply from './Reply';
import RemovalPopup from './RemovalPopup';

import { RepliesStyles as styles } from './styles';

const mapStateToProps = state => ({
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

@connect(mapStateToProps, null, null, { withRef: true })
class Replies extends Component {
	constructor(props) {
		super(props);
		this.replyRefs = {};
		this.state = {
			canLoadAbove: false,
			removalPopupOpen: false,
			reportPopupOpen: false,
			targetItem: null,
			canLoadMore: true,
		};
	}

	async componentDidMount() {
		const { loadReplies, selectedID } = this.props;
		const count = await loadReplies(selectedID);
		if (count < 20) {
			this.setState({ canLoadMore: false });
		}
		if (selectedID !== null) {
			this.scrollToId(parseInt(selectedID, 10));
		}
		if (this.props.replies.length && this.props.replies[0].index !== 0) {
			this.setState({ canLoadAbove: true });
		}
	}

	componentWillReceiveProps(nextProps) {
		if (nextProps.replies.length > 0 &&
			nextProps.replies[0].index === 0 &&
			this.state.canLoadAbove) {
			this.setState({ canLoadAbove: false });
		}
	}

	toggleRemovalPopup = (targetItem = null) => {
		const { removalPopupOpen } = this.state;
		this.setState({ removalPopupOpen: !removalPopupOpen, targetItem });
	}

	toggleReportPopup = (targetItem = null) => {
		const { reportPopupOpen } = this.state;
		this.setState({ reportPopupOpen: !reportPopupOpen, targetItem });
	}
	loadReplies = async () => {
		const length = await this.props.loadReplies();
		if (length < 20) {
			this.setState({ canLoadMore: false });
		}
	}
	scrollToId = (id) => {
		if (this.replyRefs[id]) {
			this.replyRefs[id].getWrappedInstance().scrollIntoView();
		}
	}

	render() {
		const {
			accessLevel, replies,
		} = this.props;
		const {
			removalPopupOpen, reportPopupOpen, targetItem, canLoadMore, canLoadAbove,
		} = this.state;
		if (replies.length === 0 && !canLoadMore && !canLoadAbove) {
			return <div style={{ marginTop: 10 }}>No replies</div>;
		}
		return (
			<Paper style={styles.container}>
				{canLoadAbove && replies.length > 0 &&
					<RaisedButton
						label="Load more"
						onClick={this.props.loadPreviousReplies}
					/>}
				<InfiniteScroll
					loadMore={this.loadReplies}
					hasMore={canLoadMore}
					initialLoad={false}
					loader={<CircularProgress
						style={{ display: 'flex', alignItems: 'center', margin: 'auto' }}
						key="circular-progress"
						size={40}
					/>}
				>
					{replies.map(reply => (
						<Reply
							key={reply.id}
							ref={(node) => { this.replyRefs[reply.id] = node; }}
							reply={reply}
							t={this.props.t}
							votePost={this.props.votePost}
							remove={this.props.openDeletePopup}
							toggleReportPopup={this.toggleReportPopup}
							isUsersQuestion={this.props.isUsersQuestion}
							toggleRemovalPopup={this.toggleRemovalPopup}
						/>
					))}
				</InfiniteScroll>
				<ReportPopup
					open={reportPopupOpen}
					itemType={ReportItemTypes.post}
					itemId={targetItem ? targetItem.id : 0}
					onRequestClose={this.toggleReportPopup}
				/>
				<RemovalPopup
					post={targetItem}
					open={removalPopupOpen}
					itemType={ReportItemTypes.post}
					accessLevel={accessLevel}
					itemId={targetItem ? targetItem.id : 0}
					onRequestClose={this.toggleRemovalPopup}
				/>
			</Paper>
		);
	}
}

export default Replies;
