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
	backgroundColor: 'inherit', // Inherit parent's color if not provided
};

export default Label;
