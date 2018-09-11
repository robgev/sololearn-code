import React from 'react';
import SvgIcon from 'material-ui/SvgIcon';

const StepIcon = ({ active, completed, text }) => {
	const size = active ? 24 : 20;
	return (
		<SvgIcon
			color={active ? '#607D8B' : completed ? '#8BC34A' : '#9E9E9E'}
			style={{
				display: 'block',
				fontSize: 24,
				width: size,
				height: size,
			}}
		>
			<circle cx="12" cy="12" r={size / 2} />
			<text
				x="12"
				y="16"
				textAnchor="middle"
				fontSize="12"
				fill="#fff"
			>
				{completed ? '✔' : text}
			</text>
		</SvgIcon>
	);
};

export default StepIcon;
