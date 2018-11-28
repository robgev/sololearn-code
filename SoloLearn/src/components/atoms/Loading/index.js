import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './styles.scss';

const Loading = ({ ...props }) => (
	<CircularProgress
		className="atom_loading"
		classes={{ circle: 'circle' }}
		size={50}
		{...props}
	/>
);

export default Loading;
