import React from 'react';

import './styles.scss';

const IconLabel = ({ className, ...props }) =>
	<span className={`atom_icon-label ${className}`} {...props} />;

IconLabel.defaultProps = {
	className: '',
};

export default IconLabel;
