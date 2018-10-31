import React from 'react';
import CircularProgress from '@material-ui/core/CircularProgress';

const Loading = ({ className, size, ...props }) => (
	<CircularProgress className={`atom_loading ${className}`} size={50} {...props} />
);

Loading.defaultProps = {
	className: '',
};

export default Loading;
