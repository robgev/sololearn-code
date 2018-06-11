import React, { Component } from 'react';
import {
	List,
	CellMeasurer,
	WindowScroller,
	AutoSizer,
} from 'react-virtualized';
import { findIndex } from 'lodash';
import Radium from 'radium';

import 'react-virtualized/styles.css';
import './ListStyle.css';

class InfiniteVirtalizedList extends Component {
	constructor(props) {
		super(props);
		this.width = props.width || 300;
		this.height = props.height || 300;
		this.rowHeight = props.rowHeight || 20;
		this.item = props.item;
		this.canLoadMore = true;
		this.state = { index: null };
	}
	componentWillMount() {
		this.loadMoreInterval = setInterval(() => { this.canLoadMore = true; }, 10 * 1000);
	}
	// componentDidUpdate(prevProps) {
	// 	const { condition, list } = this.props;
	// 	if (prevProps.list.length === 0 && list.length > 0 && condition) {
	// 		this._scrollTo(condition);
	// 	}
	// }
	componentWillReceiveProps(nextProps) {
		const { length: nextLength } = nextProps.list;
		const { length: currLengh } = this.props.list;
		if (nextLength !== currLengh) {
			this.canLoadMore = true;
		}
	}

	_markFull = () => {
		this.canLoadMore = false;
	}

	recomputeRowHeights = (index = null) => {
		if (index == null) {
			this.props.cache.clearAll();
			this._list.recomputeRowHeights();
		} else if (index >= 0) {
			for (let i = index; i < this.props.list.length; i += 1) { this.props.cache.clear(i); }
			this._list.recomputeRowHeights(index);
		}
	}

	_forceUpdate = () => this._list.forceUpdateGrid()

	_scrollTo = (id) => {
		const index = findIndex(this.props.list, el => el.id && el.id.toString() === id.toString());
		this._list.scrollToRow(index);
		this.setState({ index }, () => this._forceUpdate());
	}

	handleNextFetch = async ({ stopIndex }) => {
		if (stopIndex === this.props.list.length - 5 && this.canLoadMore) {
			this.canLoadMore = false;
			await this.props.loadMore();
		}
	}

	handlePreviousFetch = () => {
		this.props.loadPrevious();
	}

	rowRenderer = ({ key, index, style }) => {
		const isSelected = index === this.state.index;
		const className = isSelected ? 'fadeOut' : '';
		if (isSelected) setTimeout(() => this.setState({ index: null }), 2000);
		return (
			<div key={key} className={className} style={style}>
				{this.props.item(this.props.list[index])}
			</div>
		);
	};

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
					scrollElement={this.props.scrollElement || window}
				>
					{({
						height, registerChild, scrollTop, onChildScroll,
					}) => (
						<div style={{ flex: '1 1 auto ' }}>
							<AutoSizer disableHeight>
								{({ width }) => (
									<div ref={registerChild}>
										<List
											autoHeight
											width={width}
											height={height}
											scrollTop={scrollTop}
											onScroll={onChildScroll}
											rowCount={this.props.list.length}
											ref={(list) => { this._list = list; }}
											additional={this.props.additional}
											rowHeight={this.props.cache.rowHeight}
											onRowsRendered={this.handleNextFetch}
											rowRenderer={this.autoSizedRowRenderer}
											deferredMeasurementCache={this.props.cache}
										/>
									</div>
								)}
							</AutoSizer>
						</div>
					)}
				</WindowScroller>
			);
		} else if (this.props.window) {
			return (
				<AutoSizer disableHeight>
					{({ width }) => (
						<WindowScroller>
							{
								({ height, scrollTop }) => (
									<List
										autoHeight
										scrollTop={scrollTop}
										onRowsRendered={this.handleNextFetch}
										width={width}
										height={height}
										rowCount={this.props.list.length}
										ref={(list) => { this._list = list; }}
										rowRenderer={this.rowRenderer}
										rowHeight={this.rowHeight}
									/>
								)
							}
						</WindowScroller>
					)}
				</AutoSizer>
			);
		} else if (this.props.cache) {
			return (
				// <WindowScroller>
				// 	{
				// 		({ height, scrollTop }) => (
				<AutoSizer>
					{
						({ width, height }) => (
							<List
								// autoHeight
								onRowsRendered={this.handleNextFetch}
								width={width}
								rowCount={this.props.list.length}
								ref={(list) => { this._list = list; }}
								height={height}
								rowHeight={this.props.cache.rowHeight}
								deferredMeasurementCache={this.props.cache}
								rowRenderer={this.autoSizedRowRenderer}
							/>
						)
					}
				</AutoSizer>
				// 		)
				// 	}
				// </WindowScroller>
			);
		}
		return (
			<AutoSizer disableHeight>
				{({ width }) => (
					<List
						width={width}
						height={this.height}
						rowHeight={this.rowHeight}
						rowRenderer={this.rowRenderer}
						rowCount={this.props.list.length}
						ref={(list) => { this._list = list; }}
						onRowsRendered={this.handleNextFetch}
					/>
				)}
			</AutoSizer>
		);
	}
}

export default Radium(InfiniteVirtalizedList);
