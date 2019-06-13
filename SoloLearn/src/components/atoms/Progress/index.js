import React from 'react';
import LinearProgress from '@material-ui/core/LinearProgress';
import './styles.scss';

const Progress = props => (
	<LinearProgress
		variant="determinate"
		color="secondary"
		classes={{
			root: 'atom_progress-bar_root',
			bar: 'atom_progress-bar',
		}}
		{...props}
	/>
);

export default Progress;
