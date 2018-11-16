import React from 'react';
import { Title, PaperContainer, Container } from 'components/atoms';

import 'styles/busyWrapper.scss';

const BusyWrapper = ({
	title,
	style,
	paper,
	isBusy,
	children,
	className = '',
	noDisplay = true,
	loadingComponent,
	wrapperClassName = '',
}) => {
	const ContentContainer = paper ? PaperContainer : Container;
	return (
		<Container className={`busy-wrap-container ${className}`}>
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
					<Container className="card-title">
						<Title>{title}</Title>
					</Container>
				}
				{children}
			</ContentContainer>
			{isBusy &&
				loadingComponent
			}
		</Container>
	);
};
export default BusyWrapper;
