import React from 'react';
import CheckCircle from 'material-ui/svg-icons/action/check-circle';
import SvgIcon from 'material-ui/SvgIcon';

const iconStyle = {
	display: 'block',
	fontSize: 24,
	width: 24,
	height: 24,
};

const StepIcon = ({ active, completed, text }) => {
	if (completed) {
		return (
			<CheckCircle
				color="#8BC34A"
				style={iconStyle}
			/>
		);
	}

	return (
		<SvgIcon
			color={active ? '#607D8B' : '#9E9E9E'}
			style={iconStyle}
		>
			<circle cx="12" cy="12" r={active ? 12 : 10} />
			<text
				x="12"
				y="16"
				textAnchor="middle"
				fontSize="12"
				fill="#fff"
			>
				{text}
			</text>
		</SvgIcon>
	);
};

export default StepIcon;
