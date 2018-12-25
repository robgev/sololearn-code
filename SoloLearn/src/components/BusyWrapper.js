import React from 'react';
import { Heading, Title, PaperContainer, Container } from 'components/atoms';

import 'styles/busyWrapper.scss';

const BusyWrapper = ({
	title,
	style,
	paper,
	isBusy,
	heading,
	children,
	className,
	noDisplay,
	loadingComponent,
	wrapperClassName,
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
					null : (
						heading ?
							<Heading>{title}</Heading> :
							<Title>{title}</Title>
					)
				}
				{children}
			</ContentContainer>
			{isBusy &&
				loadingComponent
			}
		</Container>
	);
};

BusyWrapper.defaultProps = {
	className: '',
	noDisplay: true,
	wrapperClassName: '',
};

export default BusyWrapper;
