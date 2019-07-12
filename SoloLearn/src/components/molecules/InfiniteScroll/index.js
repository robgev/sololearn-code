import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RInfiniteScroll from 'react-infinite-scroller';
import { Loading, Container } from 'components/atoms';

import './styles.scss';

const Loader = () => (
	<Container className="molecule_infinit-scroll-loading"><Loading /></Container>
);

const InfiniteScroll = ({
	children, hasMore, isLoading, outerLoading, ...props
}) => (
	<Fragment>
		<RInfiniteScroll
			hasMore={hasMore}
			loader={outerLoading ? null : <Loader />}
			{...props}
		>
			{children}
		</RInfiniteScroll>
		{outerLoading && isLoading && hasMore ? <Loader /> : null}
	</Fragment>
);

InfiniteScroll.propTypes = {
	hasMore: PropTypes.bool.isRequired,
	loadMore: PropTypes.func.isRequired,
	isLoading: PropTypes.bool,
	outerLoading: PropTypes.bool,
};

InfiniteScroll.defaultProps = {
	isLoading: true,
	outerLoading: true,
};

export default InfiniteScroll;
