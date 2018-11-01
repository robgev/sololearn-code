import React from 'react';
import { Link } from 'components/atoms';

import './styles.scss';

const RefLink = ({ className, ...props }) => (
	<Link className={`molecule_ref-link ${className}`} {...props} target="_blank" />
);

RefLink.defaultProps = {
	className: '',
};

export default RefLink;
