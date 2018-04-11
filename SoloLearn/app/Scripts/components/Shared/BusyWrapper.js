import React from 'react';

import 'styles/busyWrapper.scss';

const BusyWrapper = ({
	style,
	isBusy,
	children,
	className,
	loadingComponent,
	wrapperClassName = '',
}) => (
	<div className={`content-wrapper ${className}`}>
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
