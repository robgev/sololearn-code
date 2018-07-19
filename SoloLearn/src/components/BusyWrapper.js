import React from 'react';
import Paper from 'material-ui/Paper';

import 'styles/busyWrapper.scss';

const PlainContainer = ({ children, className, style }) => (
	<div style={style} className={className}>
		{children}
	</div>
);

const BusyWrapper = ({
	title,
	style,
	paper,
	isBusy,
	children,
	className,
	noDisplay = true,
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
					...((isBusy && !noDisplay) ? { opacity: 0 } : {}),
					...((isBusy && noDisplay) ? { display: 'none' } : {}),
				}}
			>
				{!title ?
					null :
					<div className="card-title">
						<p>{title}</p>
					</div>
				}
				{children}
			</ContentContainer>
			{isBusy &&
				loadingComponent
			}
		</div>
	);
};
export default BusyWrapper;
