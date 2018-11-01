import React from 'react';
import { Link } from 'components/atoms';

import './styles.scss';

const UsernameLink = ({ className, ...props }) => (
	<Link className={`molecule_username-link ${className}`} {...props} />
);

export default UsernameLink;
