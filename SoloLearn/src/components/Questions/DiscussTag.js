import React from 'react';
import { Link } from 'react-router';

import { DiscussTagStyles as styles } from './styles';

const DiscussTag = ({ tag, index }) => (
	<div
		style={index === 0 ? styles.base : { ...styles.base, ...styles.margin }}
	>
		<Link
			to={{ pathname: '/discuss', query: { query: tag } }}
			style={styles.none}
		>
			{tag}
		</Link>
	</div>
);

export default DiscussTag;
