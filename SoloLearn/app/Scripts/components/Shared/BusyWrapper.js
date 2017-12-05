import React from 'react';
import Paper from 'material-ui/Paper';
import CircularProgress from 'material-ui/CircularProgress';

import 'styles/busyWrapper.scss';

const BusyWrapper = ({
	style,
	isBusy,
	children,
}) => (
	<div className="busy-wrap-container">
		<Paper
			style={{
				...style,
				width: '100%',
				opacity: isBusy ? 0.2 : 1,
				backgroundColor: 'white',
			}}
		>
			{children}
		</Paper>
		{	isBusy &&
			<div className="progress-wrapper">
				<CircularProgress
					size={50}
					color="#FF9800"
				/>
			</div>
		}
	</div>
);

export default BusyWrapper;
