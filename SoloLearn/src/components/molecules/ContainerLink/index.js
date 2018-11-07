import React from 'react';
import { Link } from 'components/atoms';

import './styles.scss';

const ContainerLink = ({ className, ...props }) => (
	<Link className={`molecule_container-link ${className}`} {...props} />
);

export default ContainerLink;
