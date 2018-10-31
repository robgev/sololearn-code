import React, { Fragment } from 'react';
import InfiniteScroll from 'react-infinite-scroller';
import Loading from '@material-ui/core/CircularProgress';

const InfiniteScrollList = ({ children, isLoading, ...props }) => (
	<Fragment>
		<InfiniteScroll
			{...props}
		>
			{children}
		</InfiniteScroll>
		{isLoading ? <Loading /> : null}
	</Fragment>
);

InfiniteScrollList.defaultProps = {
	hasMore: false,
	isLoading: false,
};

export default InfiniteScrollList;
