import React from 'react';
import './styles.scss';

const Label = ({ className, ...props }) => (
	<span
		className={`atom_label ${className}`}
		{...props}
	/>
);

Label.defaultProps = {
	className: '',
};

export default Label;
