import React, { useRef, useEffect, useState } from 'react';
import {
	WindowScroller,
	AutoSizer,
	List,
	CellMeasurer,
	CellMeasurerCache,
	InfiniteLoader,
} from 'react-virtualized';
import {
	Container,
	Loading,
} from 'components/atoms';

import './styles.scss';

const InfiniteVirtualizedList = ({
	rowRenderer,
	loading,
	isRowLoaded,
	loadMore,
	rowCount,
	listRowCount,
	shouldReset,
	afterReset,
}) => {
	const [ _scrollToIndex, setIndex ] = useState(undefined);
	const _windowScroller = useRef(null);
	const _list = useRef(null);
	const _cache_ = useRef(null);
	const _lastPosition = useRef(0);
	// Cache shouldn't change on every render
	// We need to lazily set cache
	// https://reactjs.org/docs/hooks-faq.html
	// Refer to section How to create expensive objects lazily?
	const getCache = () => {
		if (_cache_.current === null) {
			_cache_.current = new CellMeasurerCache({
				minHeight: 84,
				defaultWidth: 699,
				fixedWidth: true,
			});
		}
		return _cache_.current;
	};

	const _cache = getCache();
	const updatePosition = () => {
		if (_windowScroller.current) {
			_windowScroller.current.updatePosition();
		}
	};

	useEffect(() => {
		// This hook handles the cases when
		// a new item is created, or one of the items
		// is deleted. This should be called anytime
		// the list indices of feed items change.
		if (shouldReset && _list.current) {
			_cache.clearAll();
			_list.current.recomputeRowHeights();
			setIndex(0);
			afterReset();
		}
	}, [ shouldReset ]);

	const _rowRenderer = ({
		key,
		style,
		index,
		parent,
	}) => (
		<CellMeasurer
			cache={_cache}
			columnIndex={0}
			key={key}
			rowIndex={index}
			parent={parent}
		>
			{({ measure }) => (
				rowRenderer({
					style,
					index,
					measure,
					updatePosition,
				})
			)}
		</CellMeasurer>
	);
	const _isRowLoaded = index => isRowLoaded(index);
	const _loadMore = () => {
		if (loading) {
			return;
		}
		loadMore();
	};
	const loadMoreOnScroll = ({ clientHeight, scrollTop, scrollHeight }) => { // if feed's last element is groupped challange, load more element on scroll
		if (scrollHeight - (scrollTop + clientHeight) < 10) {
			_loadMore(_lastPosition.current);
		}
	};

	return (
		<Container className="infinite-loader_container">
			<InfiniteLoader
				isRowLoaded={_isRowLoaded}
				loadMoreRows={() => {}}
				rowCount={rowCount}
			>
				{({ onRowsRendered, registerChild }) => (
					<WindowScroller ref={_windowScroller}>
						{({
							height, isScrolling, onChildScroll, scrollTop,
						}) => (
							<Container>
								<AutoSizer disableHeight>
									{({ width }) => (
										<List
											autoHeight
											width={width}
											height={height}
											ref={(el) => {
												registerChild(el);
												_list.current = el;
											}}
											scrollTop={scrollTop}
											overscanRowCount={5}
											rowCount={listRowCount}
											isScrolling={isScrolling}
											onScroll={(param) => { loadMoreOnScroll(param); onChildScroll(param); }}
											rowRenderer={_rowRenderer}
											rowHeight={_cache.rowHeight}
											scrollToIndex={_scrollToIndex}
											onRowsRendered={onRowsRendered}
											deferredMeasurementCache={_cache}
										/>
									)}
								</AutoSizer>
							</Container>
						)}
					</WindowScroller>
				)}
			</InfiniteLoader>
			{loading &&
				<Loading />
			}
		</Container>
	);
};

export default InfiniteVirtualizedList;
