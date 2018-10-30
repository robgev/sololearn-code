import React from 'react';

import './styles.scss';

const TextBlock = ({ className, ...props }) => (
	<span className={`atom_text-block ${className}`} {...props} />
);

TextBlock.defaultProps = {
	className: '',
};

export default TextBlock;
