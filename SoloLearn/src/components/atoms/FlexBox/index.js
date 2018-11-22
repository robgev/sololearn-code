import React, { forwardRef } from 'react';
import Container from '../Container';

import './styles.scss';

const FlexBox = forwardRef(({
	justify, justifyBetween, align, column, className, ...props
}, ref) => {
	const columnCN = column ? 'column' : '';
	const justifyCN = justify ? 'justify-center' : '';
	const alignCN = align ? 'align-center' : '';
	const justifyBetweenCN = justifyBetween ? 'justify-between' : '';
	const fullCN = `atom_flexbox ${columnCN} ${justifyCN} ${alignCN} ${justifyBetweenCN} ${className}`;
	return (
		<Container
			ref={ref}
			className={fullCN}
			{...props}
		/>
	);
});

FlexBox.defaultProps = {
	className: '',
	column: false,
	justify: false,
	align: false,
	justifyBetween: false,
};

export default FlexBox;
