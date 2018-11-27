import React from 'react';

const TextContainer = ({ className, ...props }) =>
	<span className={`atom_text-container ${className}`} {...props} />;

TextContainer.defaultProps = {
	className: '',
};

export default TextContainer;
