import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './styles.scss';

const Progress = ({ className, classes, ...props }) =>
	(<LinearProgress
		variant="determinate"
		className={`atom_progress ${className}`}
		classes={{ barColorPrimary: 'atom_progress-primary', ...classes }}
		{...props}
	/>);

Progress.defaultProps = {
	className: '',
	classes: {},
};

export default Progress;
