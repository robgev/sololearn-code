import React from 'react';
import { FlexBox, Loading } from 'components/atoms';

import './styles.scss';

const OverlayLoading = () => (
	<FlexBox fullWidth align className="overlay-loading-container">
		<Loading />
	</FlexBox>
);

export default OverlayLoading;
