// React modules
import React, { Component } from 'react';
import { connect } from 'react-redux';
import { CellMeasurerCache } from 'react-virtualized';
import RaisedButton from 'material-ui/RaisedButton';
import Paper from 'material-ui/Paper';

import { determineAccessLevel } from 'utils';
import ReportItemTypes from 'constants/ReportItemTypes';
import ReportPopup from 'components/Shared/ReportPopup';
import InfiniteVirtualizedList from 'components/Shared/InfiniteVirtualizedList';

// Additional components
import Reply from './Reply';
import RemovalPopup from './RemovalPopup';

import { RepliesStyles as styles } from './styles';

const mapStateToProps = state => ({
	accessLevel: determineAccessLevel(state.userProfile.accessLevel),
});

const cache = new CellMeasurerCache({
	defaultWidth: 1000,
	minWidth: 75,
	fixedWidth: true,
});

@connect(mapStateToProps, null, null, { withRef: true })
class Replies extends Component {
	constructor(props) {
		super(props);
		this.state = {
			canLoadAbove: !!props.replies[0] && props.replies[0].index === 0,
			removalPopupOpen: false,
			reportPopupOpen: false,
			targetItem: null,
		};
	}
	componentWillReceiveProps(nextProps) {
		if (this.props.orderBy !== nextProps.orderBy ||
			(this.props.replies.length && this.props.replies[0] !== nextProps.replies[0])) {
			this.recompute();
		}
		if (nextProps.replies.length > 0 &&
			nextProps.replies[0].index === 0 &&
			this.state.canLoadAbove) {
			this.setState({ canLoadAbove: false });
		}
	}
	componentWillUnmount() {
		cache.clearAll();
	}
	toggleRemovalPopup = (targetItem = null) => {
		const { removalPopupOpen } = this.state;
		this.setState({ removalPopupOpen: !removalPopupOpen, targetItem });
	}

	toggleReportPopup = (targetItem = null) => {
		const { reportPopupOpen } = this.state;
		this.setState({ reportPopupOpen: !reportPopupOpen, targetItem });
	}
	recompute = (index) => { this._list.recomputeRowHeights(index); }
	scrollTo = (id) => { this._list._scrollTo(id); }
	renderReply = reply => (
		<Reply
			key={reply.id}
			reply={reply}
			t={this.props.t}
			recompute={this.recompute}
			votePost={this.props.votePost}
			remove={this.props.openDeletePopup}
			toggleReportPopup={this.toggleReportPopup}
			isUsersQuestion={this.props.isUsersQuestion}
			toggleRemovalPopup={this.toggleRemovalPopup}
		/>
	)

	_forceUpdate = () => this._list._forceUpdate();

	render() {
		const { accessLevel, scrollElement } = this.props;
		const { removalPopupOpen, reportPopupOpen, targetItem } = this.state;
		return (
			<Paper style={styles.container}>
				{this.state.canLoadAbove && this.props.replies.length > 0 &&
					<RaisedButton
						label="Load more"
						onClick={this.props.loadPreviousReplies}
					/>}
				<InfiniteVirtualizedList
					additional={this.props.orderBy}
					item={this.renderReply}
					list={this.props.replies}
					loadMore={this.props.loadReplies}
					cache={cache}
					window
					scrollElement={scrollElement}
					ref={(list) => { this._list = list; }}
				/>
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
