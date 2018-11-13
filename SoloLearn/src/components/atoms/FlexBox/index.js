import React from 'react';
import Container from '../Container';

import './styles.scss';

const FlexBox = ({
	justify, align, column, className, ...props
}) => {
	const columnClassName = column ? 'column' : '';
	const justifyClassName = justify ? 'justify-center' : '';
	const alignClassName = align ? 'align-center' : '';
	const fullClassName = `atom_flexbox ${columnClassName} ${justifyClassName} ${alignClassName} ${className}`;
	return (
		<Container
			className={fullClassName}
			{...props}
		/>
	);
};

FlexBox.defaultProps = {
	className: '',
	column: false,
	justify: false,
	align: false,
};

export default FlexBox;
