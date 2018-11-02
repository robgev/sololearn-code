import React from 'react';
import SvgIcon from '@material-ui/core/SvgIcon';
import './styles.scss';

const StepIcon = ({
	active, completed, text, className, disabled, ...props
}) => {
	const size = active ? 24 : 20;
	const classes = `atom_step_icon ${active ? 'atom_step_icon_active ' : ''} ${completed ? 'atom_step_icon_completed ' : ''} ${disabled ? 'atom_step_icon_disabled ' : ''}`;

	return (
		<SvgIcon
			className={`${classes} ${className}`}
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

StepIcon.defaultProps = {
	className: '',
	active: false,
	completed: false,
	text: '',
	disabled: false,
};

export default StepIcon;
