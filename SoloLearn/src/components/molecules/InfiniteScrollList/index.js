import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
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

InfiniteScrollList.propTypes = {
	hasMore: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	loadMore: PropTypes.func.isRequired,
};

export default InfiniteScrollList;
