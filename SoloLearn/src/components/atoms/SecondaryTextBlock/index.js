import React from 'react';

import './styles.scss';

const SecondaryTextBlock = ({ className, ...props }) =>
	<span className={`atom_secondary-text-block ${className}`} {...props} />;

SecondaryTextBlock.defaultProps = {
	className: '',
};

export default SecondaryTextBlock;
