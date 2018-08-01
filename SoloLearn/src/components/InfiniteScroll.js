import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import InfiniteScroll from 'react-infinite-scroller';

const InfiniteScrollWrapper = ({
	children, element: Element, header, threshold, ...rest
}) => (
	<div>
		<Element>
			{header}
			<InfiniteScroll
				threshold={threshold}
				{...rest}
				loader={null}
			>
				{children}
			</InfiniteScroll>
		</Element>
		{
			rest.hasMore && children.length !== 0 &&
				<CircularProgress
					size={40}
					style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}
				/>
		}
	</div>
);

InfiniteScrollWrapper.defaultProps = {
	element: Paper,
	header: null,
	threshold: 500,
};

export default InfiniteScrollWrapper;
