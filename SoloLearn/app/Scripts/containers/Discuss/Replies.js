// React modules
import React, { Component } from 'react';
import {
	CellMeasurerCache,
} from 'react-virtualized';
import InfiniteVirtualizedList from '../../components/Shared/InfiniteVirtualizedList';

// Additional components
import Reply from './Reply';

const cache = new CellMeasurerCache({
	defaultWidth: 1000,
	minWidth: 75,
	fixedWidth: true,
});

class Replies extends Component {
	forceUpdate = () => {
		this._list.forceUpdate();
	}
	renderReply = reply => (
		<Reply
			key={reply.id}
			reply={reply}
			votePost={this.props.votePost}
			remove={this.props.openDeletePopup}
			isUsersQuestion={this.props.isUsersQuestion}
		/>
	)
	render() {
		return (
			<div id="replies">
				<InfiniteVirtualizedList
					additional={this.props.orderBy}
					item={this.renderReply}
					list={this.props.replies}
					loadMore={this.props.loadReplies}
					width={1000}
					cache={cache}
					condition={this.props.condition}
					ref={(list) => { this._list = list; }}
					window
				/>
			</div>
		);
	}
}

export default Replies;
