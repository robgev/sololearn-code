import React from 'react';
import { FlexBox } from 'components/atoms';

import './styles.scss';

const IconWithText = ({ Icon, children }) => (
	<FlexBox align className="molecule_icon-with-text">
		<Icon className="icon" />
		{children}
	</FlexBox>
);

export default IconWithText;
