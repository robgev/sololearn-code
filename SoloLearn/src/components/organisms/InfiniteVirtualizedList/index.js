import React, { useRef } from 'react';
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
	hasMore,
	listRowCount,
}) => {
	const _windowScroller = useRef(null);
	const _cache_ = useRef(null);
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
	const _loadMore = loading ? () => {} : loadMore;

	return (
		<Container className="infinite-loader_container">
			<InfiniteLoader
				isRowLoaded={_isRowLoaded}
				loadMoreRows={_loadMore}
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
											ref={registerChild}
											scrollTop={scrollTop}
											overscanRowCount={5}
											rowCount={listRowCount}
											isScrolling={isScrolling}
											onScroll={onChildScroll}
											rowRenderer={_rowRenderer}
											rowHeight={_cache.rowHeight}
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
			{ (loading && hasMore) &&
				<Loading />
			}
		</Container>
	);
};

export default InfiniteVirtualizedList;