import React from 'react';
import { Link } from 'react-router';

import './styles.scss';

const DefaultLink = ({ className, ...props }) => (
	<Link className={`atom_link ${className}`} {...props} />
);

DefaultLink.defaultProps = {
	className: '',
};

export default DefaultLink;
