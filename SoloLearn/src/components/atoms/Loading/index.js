import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

import './styles.scss';

const Loading = ({ ...props }) => (
	<CircularProgress classes={{ circle: 'atom_loading' }} size={50} {...props} />
);

export default Loading;
