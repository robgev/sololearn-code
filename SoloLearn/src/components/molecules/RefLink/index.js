import React from 'react';
import { Link } from 'components/atoms';

import './styles.scss';

const RefLink = ({ className, href,  ...props }) => (
	<Link to={href} target='_blank' className={`molecule_ref-link ${className}`} {...props} />
);

RefLink.defaultProps = {
	className: '',
};
export default RefLink;
