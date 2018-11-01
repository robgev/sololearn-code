import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';

const Progress = props => (
	<LinearProgress
		variant="determinate"
		{...props}
	/>
);

export default Progress;
