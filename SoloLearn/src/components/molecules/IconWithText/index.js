import React from 'react';
import { FlexBox } from 'components/atoms';

import './styles.scss';

const IconWithText = ({
	Icon,
	children,
	className,
	iconClassname = '',
	...props
}) => (
	<FlexBox align className={`molecule_icon-with-text ${className}`} {...props}>
		<Icon className={`${iconClassname} icon`} />
		{children}
	</FlexBox>
);

export default IconWithText;
