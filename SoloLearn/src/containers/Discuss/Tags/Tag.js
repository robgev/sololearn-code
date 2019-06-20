import React from 'react';
import { Link } from 'components/atoms';

const Tag = ({ tag }) => (
	<Link to={{ pathname: '/discuss', query: { query: tag } }} className="tag">
		#{tag}
	</Link>
);

export default Tag;
