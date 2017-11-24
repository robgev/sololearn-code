import React, { Component } from 'react';
import {
	List,
	CellMeasurer,
	WindowScroller,
} from 'react-virtualized';
import { findIndex } from 'lodash';
import 'react-virtualized/styles.css';

class InfiniteVirtalizedList extends Component {
	constructor(props) {
		super(props);
		this.width = props.width || 300;
		this.height = props.height || 300;
		this.rowHeight = props.rowHeight || 20;
		this.item = props.item;
		this.canLoadMore = true;
	}
	componentWillMount() {
		this.loadMoreInterval = setInterval(() => { this.canLoadMore = true; }, 10 * 1000);
	}
	componentWillReceiveProps(nextProps) {
		const { length: nextLength } = nextProps.list;
		const { length: currLengh } = this.props.list;
		if (nextLength !== currLengh) {
			this.canLoadMore = true;
		}
		// if (nextProps.condition) this.scrollTo(nextProps.condition);
	}

	scrollTo = (condition) => {
		const index = findIndex(this.props.list, condition);
		if (this.props.list.length > index + 2) this._list.scrollToRow(index + 2);
		else this._list.scrollToRow(index);
	}

	handleNextFetch = async ({ stopIndex }) => {
		if (stopIndex > this.props.list.length - 15 && this.canLoadMore) {
			this.canLoadMore = false;
			await this.props.loadMore();
		}
	}

	handlePreviousFetch = () => {
		this.props.loadPrevious();
	}

	rowRenderer = ({ key, index, style }) => (
		<div key={key} style={style}>
			{this.props.item(this.props.list[index])}
		</div>
	);

	autoSizedRowRenderer = ({
		index, key, parent, style,
	}) => (
		<CellMeasurer
			cache={this.props.cache}
			columnIndex={0}
			key={key}
			parent={parent}
			rowIndex={index}
		>
			{this.rowRenderer({ key, index, style })}
		</CellMeasurer>
	)

	render() {
		if (this.props.window && this.props.cache) {
			return (
				<WindowScroller
					additional={this.props.additional}
				>
					{({ height, scrollTop, onChildScroll }) => (
						<List
							autoHeight
							onRowsRendered={this.handleNextFetch}
							width={this.width}
							rowCount={this.props.list.length}
							ref={(list) => { this._list = list; }}
							additional={this.props.additional}
							height={height}
							scrollTop={scrollTop}
							onScroll={onChildScroll}
							rowHeight={this.props.cache.rowHeight}
							deferredMeasurementCache={this.props.cache}
							rowRenderer={this.autoSizedRowRenderer}
						/>
					)
					}
				</WindowScroller>
			);
		} else if (this.props.window) {
			return (
				<WindowScroller>
					{
						({ height, scrollTop }) => (
							<List
								autoHeight
								scrollTop={scrollTop}
								onRowsRendered={this.handleNextFetch}
								width={this.width}
								height={height}
								rowCount={this.props.list.length}
								ref={(list) => { this._list = list; }}
								rowRenderer={this.rowRenderer}
								rowHeight={this.rowHeight}
							/>
						)
					}
				</WindowScroller>
			);
		}
		return (
			<List
				onRowsRendered={this.handleNextFetch}
				width={this.width}
				height={this.height}
				rowCount={this.props.list.length}
				ref={(list) => { this._list = list; }}
				rowRenderer={this.rowRenderer}
				rowHeight={this.rowHeight}
			/>
		);
	}
}

export default InfiniteVirtalizedList;
