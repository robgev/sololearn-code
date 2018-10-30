import React from 'react';

import './styles.scss';

const Title = ({ className, ...props }) => (
	<span className={`atom_title ${className}`} {...props} />
);

Title.defaultProps = {
	className: '',
};

export default Title;
