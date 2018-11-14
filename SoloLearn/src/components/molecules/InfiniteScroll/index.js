import React, { Fragment } from 'react';
import PropTypes from 'prop-types';
import RInfiniteScroll from 'react-infinite-scroller';
import { Loading, Container } from 'components/atoms';

import './styles.scss';

const InfiniteScroll = ({ children, isLoading, ...props }) => (
	<Fragment>
		<RInfiniteScroll
			{...props}
		>
			{children}
		</RInfiniteScroll>
		{isLoading ? <Container className="molecule_infinit-scroll-loading"><Loading /></Container> : null}
	</Fragment>
);

InfiniteScroll.propTypes = {
	hasMore: PropTypes.bool.isRequired,
	isLoading: PropTypes.bool.isRequired,
	loadMore: PropTypes.func.isRequired,
};

export default InfiniteScroll;
