import React from 'react';
import Progress from '@material-ui/core/CircularProgress';
import './styles.scss';

const CircularProgress = ({ className, ...props }) =>{
	console.log(props.value);
	return (<Progress
		className={`atom_circular-progress ${className}`}
		size='106%'
		thickness={1.5}
		variant="static"
		{...props}
	/>)
}

CircularProgress.defaultProps = {
	className: '',
};
export default CircularProgress;