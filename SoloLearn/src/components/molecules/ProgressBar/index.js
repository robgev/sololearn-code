import React from 'react';
import { Progress, Container } from 'components/atoms';
import './styles.scss';

const ProgressBar = ({ className, value, minText, maxText, ...props }) => (
		<Container className={`molecule_progress-bar ${className}`} {...props}>
			<Progress  value={value} />
			<span className='molecule_progress-bar-label molecule_progress-bar-label-left'>{minText}</span>
			<span className='molecule_progress-bar-label molecule_progress-bar-label-right'>{maxText}</span>
		</Container>
	)

ProgressBar.defaultProps = {
	className: '',
	value: 0,
	minText: '',
	maxText: '',
};
export default ProgressBar;