// React modules
import React, { Component } from 'react';
import {
	CellMeasurerCache,
} from 'react-virtualized';
import RaisedButton from 'material-ui/RaisedButton';
import InfiniteVirtualizedList from '../../components/Shared/InfiniteVirtualizedList';

// Additional components
import Reply from './Reply';

import { RepliesStyles as styles } from './styles';

const cache = new CellMeasurerCache({
	defaultWidth: 1000,
	minWidth: 75,
	fixedWidth: true,
});

class Replies extends Component {
	constructor(props) {
		super(props);
		this.state = {
			canLoadAbove: !!props.condition,
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
	recompute = (index) => { this._list.recomputeRowHeights(index); };
	renderReply = reply => (
		<Reply
			key={reply.id}
			reply={reply}
			votePost={this.props.votePost}
			remove={this.props.openDeletePopup}
			isUsersQuestion={this.props.isUsersQuestion}
		/>
	)
	_forceUpdate = () => this._list._forceUpdate();
	render() {
		return (
			<div style={styles.container}>
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
					width={1000}
					cache={cache}
					condition={this.props.condition}
					window
					ref={(list) => { this._list = list; }}
				/>
			</div>
		);
	}
}

export default Replies;
