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
		const { cache } = this.props;
		this.width = props.width || 300;
		this.height = props.height || 300;
		this.rowHeight = props.rowHeight || 20;
		this.item = props.item;
		this.canLoadMore = true;
		this.rowSettings = cache ?
			{
				rowRenderer: this.autoSizedRowRenderer,
				deferredMeasurementCache: cache,
				rowHeight: cache.rowHeight,
			} :
			{
				rowRenderer: this.rowRenderer,
				rowHeight: this.rowHeight,
			};
		// this.state = {
		// 	scrollToIndex: 0,
		// };
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
		if (nextProps.condition) this.scrollTo(nextProps.condition);
	}

	scrollTo = (condition) => {
		const index = findIndex(this.props.list, condition);
		// const scrollToIndex = index === -1 ? 0 : index;
		// this.setState({ scrollToIndex });
		if (this.props.list.length > index + 2) this._list.scrollToRow(index + 2);
		else this._list.scrollToRow(index);
	}

	handleNextFetch = ({ stopIndex }) => {
		if (stopIndex > this.props.list.length - 15 && this.canLoadMore) {
			this.props.loadMore();
			this.canLoadMore = false;
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
		const MiniList = props => (
			<List
				onRowsRendered={this.handleNextFetch}
				width={this.width}
				rowCount={this.props.list.length}
				ref={(list) => { this._list = list; }}
				{...this.rowSettings}
				{...props}
			/>
		);
		if (this.props.window) {
			return (
				<WindowScroller
					additional={this.props.additional}
				>
					{({ height, scrollTop, onChildScroll }) => (
						<MiniList
							autoHeight
							additional={this.props.additional}
							height={height}
							scrollTop={scrollTop}
							onScroll={onChildScroll}
						/>
					)
					}
				</WindowScroller>
			);
		}
		return (
			<MiniList
				height={this.height}
			/>
		);
	}
}

export default InfiniteVirtalizedList;
