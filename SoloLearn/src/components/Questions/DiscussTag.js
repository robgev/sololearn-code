import React from 'react';
import { Link, withRouter } from 'react-router';

import { DiscussTagStyles as styles } from './styles';

const DiscussTag = ({ tag, index, location }) => (
	<div
		style={index === 0 ? styles.base : { ...styles.base, ...styles.margin }}
	>
		<Link
			to={{ pathname: '/discuss', query: { ...location.query, query: tag } }}
			style={styles.none}
		>
			{tag}
		</Link>
	</div>
);

export default withRouter(DiscussTag);
