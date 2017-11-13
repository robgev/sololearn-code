import React, { Component } from 'react';
import { List } from 'react-virtualized';

class InfiniteVirtalizedList extends Component {
	constructor(props) {
		super(props);
		this.width = props.width || 300;
		this.height = props.height || 300;
		this.rowHeight = props.rowHeight || 20;
		this.item = props.item;
		this.canLoadMore = true;
	}
	componentWillReceiveProps(nextProps) {
		const { length: nextLength } = nextProps.list;
		const { length: currLengh } = this.props.list;
		if (nextLength > currLengh) {
			this.canLoadMore = true;
		}
	}
	handleNextFetch = ({ stopIndex }) => {
		if (stopIndex > this.props.list.length - 10 && this.canLoadMore) {
			this.props.loadMore();
			this.canLoadMore = false;
		}
	}
	rowRenderer = ({ key, index, style }) => (
		<div key={key} style={style}>
			{this.props.item(this.props.list[index])}
		</div>
	);
	render() {
		return (
			<List
				onRowsRendered={this.handleNextFetch}
				width={this.width}
				height={this.height}
				rowCount={this.props.list.length}
				rowHeight={this.rowHeight}
				rowRenderer={this.rowRenderer}
			/>
		);
	}
}

export default InfiniteVirtalizedList;
