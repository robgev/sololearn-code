import React from 'react';
import { FlexBox } from 'components/atoms';

import './styles.scss';

const IconWithText = ({
	Icon,
	children,
	className,
	...props
}) => (
	<FlexBox align className={`molecule_icon-with-text ${className}`} {...props}>
		<Icon className="icon" />
		{children}
	</FlexBox>
);

export default IconWithText;
