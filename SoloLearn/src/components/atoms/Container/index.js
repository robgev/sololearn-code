import React from 'react';

const Container = ({ className, ...props }) => (
	<div className={`atom_main-container ${className}`} {...props} />
);

Container.defaultProps = {
	className: '',
};

export default Container;
