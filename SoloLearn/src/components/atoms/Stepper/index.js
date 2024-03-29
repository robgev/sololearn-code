import React from 'react';
import { ProgressBar } from 'react-step-progress-bar';
import './styles.scss';

const Stepper = ({ height, children, ...props }) => {
	const childrenArr = React.Children.toArray(children);
	const activeIndex = childrenArr.findIndex(item => item.props.active);
	const count = childrenArr.length;
	const percent = count !== 0 && activeIndex !== -1
		? (100 * activeIndex) / (count - 1)
		: 0;
	return (
		<ProgressBar
			height={height}
			percent={percent}
			filledBackground="#8BC34A"
			{...props}
		>
			{children}
		</ProgressBar>
	);
};

Stepper.defaultProps = {
	height: 7,
};

export default Stepper;
