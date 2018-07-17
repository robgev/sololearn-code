import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';
import Paper from 'material-ui/Paper';
import InfiniteScroll from 'react-infinite-scroller';

const InfiniteScrollWrapper = ({ children, element: Element, ...rest }) => (
	<div>
		<Element>
			<InfiniteScroll
				{...rest}
				loader={null}
			>
				{children}
			</InfiniteScroll>
		</Element>
		{
			rest.hasMore &&
			<CircularProgress
				size={40}
				style={{ display: 'flex', alignItems: 'center', margin: '10px auto' }}
			/>
		}
	</div>
);

InfiniteScrollWrapper.defaultProps = {
	element: Paper,
};

export default InfiniteScrollWrapper;
