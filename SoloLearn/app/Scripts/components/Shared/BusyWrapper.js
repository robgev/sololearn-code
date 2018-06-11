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
	<div className={`busy-wrap-container ${className}`}>
		<div
			className={`content-wrapper ${wrapperClassName}`}
			style={{
				...style,
				...(isBusy ? { display: 'none' } : {}),
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
