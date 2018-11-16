import React from 'react';
import PropTypes from 'prop-types';
import { Link, Container } from 'components/atoms';

const BreadCrumbs = ({ items, ...props }) => (
	<Container {...props} >
		{items.map((item, ind) =>
			(
				<Link
					to={item.link}
					key={item.link}
				>
					{`${item.text} ${ind !== items.length - 1 ? ' > ' : ''}`}
				</Link>
			))}
	</Container>
);

BreadCrumbs.propTypes = {
	items: PropTypes.arrayOf(PropTypes.shape({
		link: PropTypes.string,
		text: PropTypes.text,
	})).isRequired,
};

export default BreadCrumbs;
