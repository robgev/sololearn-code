import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RInfiniteScroll from 'react-infinite-scroller';
import Loading from '@material-ui/core/CircularProgress';

const InfiniteScroll = ({ children, isLoading, ...props }) => (
	<Fragment>
		<RInfiniteScroll
			{...props}
		>
			{children}
		</RInfiniteScroll>
		{isLoading ? <Loading /> : null}
	</Fragment>
);

InfiniteScroll.propTypes = {
	hasMore: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	loadMore: PropTypes.func.isRequired,
};

export default InfiniteScroll;
