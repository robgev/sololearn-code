import React from 'react';
import './styles.scss';

const VerticalDivider = ({ className, ...props }) =>
	<span className={`atom_vertical-divider ${className}`} {...props} />;

VerticalDivider.defaultProps = {
	className: '',
};

export default VerticalDivider;
