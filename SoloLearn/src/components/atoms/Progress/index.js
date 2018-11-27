import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './styles.scss';

const Progress = props => (
	<LinearProgress
		variant="determinate"
		color="secondary"
		{...props}
	/>
);

export default Progress;
