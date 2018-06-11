import React from 'react';
import Paper from 'material-ui/Paper';

import 'styles/busyWrapper.scss';

const PlainContainer = ({ children, className, style }) => (
	<div style={style} className={className}>
		{children}
	</div>
);

const BusyWrapper = ({
	style,
	paper,
	isBusy,
	children,
	className,
	loadingComponent,
	wrapperClassName = '',
}) => {
	const ContentContainer = paper ? Paper : PlainContainer;
	return (
		<div className={`busy-wrap-container ${className}`}>
			<ContentContainer
				className={`content-wrapper ${wrapperClassName}`}
				style={{
					...style,
					...(isBusy ? { display: 'none' } : {}),
				}}
			>
				{children}
			</ContentContainer>
			{	isBusy &&
			loadingComponent
			}
		</div>
	);
};
export default BusyWrapper;
