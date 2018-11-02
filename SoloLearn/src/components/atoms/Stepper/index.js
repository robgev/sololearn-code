import React from 'react';
import { ProgressBar } from 'react-step-progress-bar';

const Stepper = ({ height, ...props }) => {
	const { children } = props;
	let percent = 0;
	if (children.length) {
		const activeIndex = children.findIndex(item => item.props.active);
		const count = children.length;
		percent = 100 * activeIndex / (count - 1);
	}
	return (
		<ProgressBar
			height={height}
			percent={percent}
			filledBackground="#8BC34A"
			{...props}

		/>
	);
};

Stepper.defaultProps = {
	height: 7,
};

export default Stepper;
