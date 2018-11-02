import React from 'react';
import { StepIcon } from 'components/atoms';
import './styles.scss';

const Step = ({
	onClick, text, active, completed, disabled, className, ...props
}) => (
	<div
		tabIndex={0}
		role="button"
		onClick={onClick}
		className={`atom_step ${className}`}
		
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
	onClick: ()=>{},
	text: '',
};
export default Step;
