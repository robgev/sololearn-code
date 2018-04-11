import React from 'react';

import 'styles/busyWrapper.scss';

const BusyWrapper = ({
	style,
	isBusy,
	children,
	loadingComponent,
	wrapperClassName = '',
}) => (
	<div className="busy-wrap-container">
		<div
			className={`content-wrapper ${wrapperClassName}`}
			style={{
				...style,
				opacity: isBusy ? 0 : 1,
			}}
		>
			{children}
		</div>
		{	isBusy &&
			loadingComponent
		}
	</div>
);

export default BusyWrapper;
