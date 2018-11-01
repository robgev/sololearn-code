import React from 'react';

import './styles.scss';

const Heading = ({ className, ...props }) => (
	<span className={`atom_heading ${className}`} {...props} />
);

Heading.defaultProps = {
	className: '',
};

export default Heading;
