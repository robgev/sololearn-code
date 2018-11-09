import React from 'react';
import { Link } from 'components/atoms';
import { TagLabel } from 'components/molecules';

const Tag = ({ tag }) => (
	<TagLabel>
		<Link to={{ pathname: '/discuss', query: { query: tag } }}>
			{tag}
		</Link>
	</TagLabel>
);

export default Tag;
