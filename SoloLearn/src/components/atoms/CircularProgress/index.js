import React from 'react';
import Progress from '@material-ui/core/CircularProgress';
import './styles.scss';

const CircularProgress = ({ className, ...props }) => (
	<Progress
		className={`atom_circular-progress ${className}`}
		thickness={1.5}
		variant="static"
		{...props}
	/>
);

CircularProgress.defaultProps = {
	className: '',
};

export default CircularProgress;
