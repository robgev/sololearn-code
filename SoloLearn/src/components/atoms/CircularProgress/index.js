import React from 'react';
import CircularProgressbar from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import './styles.scss';

const CircularProgress = ({ className, ...props }) => (
	<CircularProgressbar
		className={`atom_circular-progress ${className}`}
		{...props}
	/>
);

CircularProgress.defaultProps = {
	className: '',
	strokeWidth: 3,
};

export default CircularProgress;
