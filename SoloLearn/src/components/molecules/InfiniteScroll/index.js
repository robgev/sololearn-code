import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RInfiniteScroll from 'react-infinite-scroller';
import { Loading, Container } from 'components/atoms';

import './styles.scss';

const InfiniteScroll = ({
	children, hasMore, isLoading, ...props
}) => (
	<Fragment>
		<RInfiniteScroll
			hasMore={hasMore}
			loader={null}
			{...props}
		>
			{children}
		</RInfiniteScroll>
		{isLoading && hasMore ? <Container className="molecule_infinit-scroll-loading"><Loading /></Container> : null}
	</Fragment>
);

InfiniteScroll.propTypes = {
	hasMore: PropTypes.bool.isRequired,
	loadMore: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
};

InfiniteScroll.defaultProps = {
	isLoading: true,
};

export default InfiniteScroll;
