import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './styles.scss';

const Progress = props => (
	<LinearProgress
		variant="determinate"
		classes={{ barColorPrimary: 'atom_progress-color', colorPrimary: 'atom_progress-bg-color' }}
		{...props}
	/>
);

export default Progress;
