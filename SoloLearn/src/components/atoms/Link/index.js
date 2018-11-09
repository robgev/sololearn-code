import React from 'react';
import { Link as RLink } from 'react-router';

import './styles.scss';

const Link = ({ className, ...props }) => (
	<RLink className={`atom_link ${className}`} {...props} />
);

Link.defaultProps = {
	className: '',
};

export default Link;
