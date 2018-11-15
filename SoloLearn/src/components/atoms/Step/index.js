import React from 'react';
import { StepIcon } from 'components/atoms';
import './styles.scss';

const Step = ({
	text,
	active,
	onClick,
	disabled,
	className,
	completed,
	...props
}) => (
	<div
		tabIndex={0}
		role="button"
		onClick={onClick}
		className={`atom_step ${className}`}
		{...props}
	>
		<StepIcon
			text={text}
			active={active}
			completed={completed}
			disabled={disabled}
		/>
	</div>
);

Step.defaultProps = {
	className: '',
	completed: false,
	active: false,
	disabled: false,
	onClick: () => {},
	text: '',
};
export default Step;
