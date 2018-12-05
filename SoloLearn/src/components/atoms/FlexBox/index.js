import React, { forwardRef } from 'react';
import Container from '../Container';

import './styles.scss';

const FlexBox = forwardRef(({
	justify,
	justifyBetween,
	align,
	column,
	className,
	noShrink,
	fullWidth,
	...props
}, ref) => {
	const columnCN = column ? 'column' : '';
	const justifyCN = justify ? 'justify-center' : '';
	const alignCN = align ? 'align-center' : '';
	const justifyBetweenCN = justifyBetween ? 'justify-between' : '';
	const fullWidthCN = fullWidth ? 'full-width' : '';
	const noShrinkCN = noShrink ? 'no-shrink' : '';
	const fullCN = `atom_flexbox ${fullWidthCN} ${columnCN} ${justifyCN} ${alignCN} ${justifyBetweenCN} ${noShrinkCN} ${className}`;

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
	noShrink: false,
	justifyBetween: false,
	fullWidth: false,
};

export default FlexBox;
