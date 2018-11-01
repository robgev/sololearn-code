import React from 'react';
import { Link } from 'components/atoms';

import './styles.scss';

const TextLink = ({ className, ...props }) => (
	<Link className={`molecule_text-link ${className}`} {...props} />
);

export default TextLink;
