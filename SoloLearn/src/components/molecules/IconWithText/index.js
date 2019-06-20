import React from 'react';
import { FlexBox } from 'components/atoms';

import './styles.scss';

const IconWithText = ({
	Icon,
	children,
	className,
	iconClassname = '',
	isIconComponent,
	...props
}) => (
	<FlexBox align className={`molecule_icon-with-text ${className}`} {...props}>
		{
			isIconComponent
				? <Icon className={`${iconClassname} icon`} />
				: <img src={Icon} alt="icon" />
		}
		{children}
	</FlexBox>
);

IconWithText.defaultProps = {
	isIconComponent: true,
};

export default IconWithText;
