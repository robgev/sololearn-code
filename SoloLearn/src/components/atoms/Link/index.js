import React from 'react';
import { Link } from 'react-router';

const DefaultLink = ({ className, ...props }) => (
	<Link className={`atom_link ${className}`} {...props} />
);

DefaultLink.defaultProps = {
	className: '',
};

export default DefaultLink;
