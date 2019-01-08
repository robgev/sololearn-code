import React, { forwardRef } from 'react';
import Container from '../Container';

import './styles.scss';

const FlexBox = forwardRef(({
	justify,
	justifyBetween,
	justifyEnd,
	align,
	alignEnd,
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
	const justifyEndCN = justifyEnd ? 'justify-end' : '';
	const alignEndCN = alignEnd ? 'align-end' : '';
	const fullWidthCN = fullWidth ? 'full-width' : '';
	const noShrinkCN = noShrink ? 'no-shrink' : '';
	const fullCN = `atom_flexbox ${fullWidthCN} ${columnCN} ${justifyCN} ${alignCN} ${justifyBetweenCN} ${justifyEndCN} ${alignEndCN} ${noShrinkCN} ${className}`;

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
