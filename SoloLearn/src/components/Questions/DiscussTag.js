import React from 'react';
import { Link } from 'react-router';
import { connect } from 'react-redux';
import { changeDiscussQueryFilter } from 'actions/discuss';

import { DiscussTagStyles as styles } from './styles';

const DiscussTag = ({ tag, index, changeQuery }) => (
	<div
		style={index === 0 ? styles.base : { ...styles.base, ...styles.margin }}
	>
		<Link
			to={{ pathname: '/discuss' }}
			onClick={() => {
				changeQuery(tag);
			}}
			style={styles.none}
		>
			{tag}
		</Link>
	</div>
);

export default connect(null, { changeQuery: changeDiscussQueryFilter })(DiscussTag);
