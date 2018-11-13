import React from 'react';
import {
	Container,
	PaperContainer,
	CircularProgress,
	SecondaryTextBlock,
} from 'components/atoms';
import { ContainerLink, RoundImage } from 'components/molecules';

const ModuleChip = ({
	to,
	state,
	name,
	onClick,
	className,
	iconSource,
	completionPercent,
}) => (
	<Container className={`module-line-container ${className}`}>
		<ContainerLink
			to={to}
			onClick={onClick}
			className={`content ${className}`}
		>
			<PaperContainer
				circle
				elevation={1}
				key={module.id}
				className={`module-circle flex-centered ${state}`}
			>
				<RoundImage className="module-image" alt="" src={iconSource} />
				{completionPercent !== 100 &&
				<CircularProgress value={completionPercent} />
				}
			</PaperContainer>
			<SecondaryTextBlock>{name}</SecondaryTextBlock>
		</ContainerLink>
	</Container>
);

ModuleChip.defaultProps = {
	completionPercent: 0,
};

export default ModuleChip;
