import React from 'react';
import './styles.scss';

const Label = ({ className, backgroundColor, ...props }) => (
	<span
		style={{ backgroundColor }}
		className={`atom_label ${className}`}
		{...props}
	/>
);

Label.defaultProps = {
	className: '',
	backgroundColor: 'unset', // Don't set any color if not provided
};

export default Label;
