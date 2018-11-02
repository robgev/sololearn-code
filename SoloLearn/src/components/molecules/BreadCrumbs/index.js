import React from 'react';
import { Link, Container } from 'components/atoms';

const BreadCrumbs = ({ items, ...props }) =>
	<Container {...props} >
		{items.map((item, ind) =>
			(<Link
				to={item.link}
			>
				{`${item.text} ${ind !== items.length - 1 ? ' > ' : ''}`}
			</Link>);
		)}
	</Container>

BreadCrumbs.defaultProps = {
	items: [],
};

export default BreadCrumbs;
