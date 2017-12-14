import React from 'react';
import CircularProgress from 'material-ui/CircularProgress';

import 'styles/busyWrapper.scss';

const BusyWrapper = ({
	style,
	isBusy,
	children,
	wrapperClassName = '',
}) => (
	<div className="busy-wrap-container">
		<div
			className={`content-wrapper ${wrapperClassName}`}
			style={{
				...style,
				opacity: isBusy ? 0.2 : 1,
			}}
		>
			{children}
		</div>
		{	isBusy &&
			<div className="progress-wrapper">
				<CircularProgress
					size={100}
				/>
			</div>
		}
	</div>
);

export default BusyWrapper;
