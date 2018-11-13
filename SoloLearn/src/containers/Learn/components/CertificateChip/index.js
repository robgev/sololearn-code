import React from 'react';
import { translate } from 'react-i18next';
import { Container, SecondaryTextBlock } from 'components/atoms';
import { ContainerLink, RoundImage } from 'components/molecules';

import './styles.scss';

const CourseChip = ({
	t,
	id,
	isFinished,
	className,
	...props
}) => {
	const WrapperComponent = isFinished ? ContainerLink : Container;
	return (
		<WrapperComponent
			to={`/certificate/${id}`}
			className={`learn_certificate-chip ${className}`}
			{...props}
		>
			<RoundImage
				alt="Course Icon"
				className="certificate-image"
				src={`/assets/certificate${isFinished ? '' : '_disabled'}.png`}
			/>
			<Container className="course-chip-info round-course-item">
				<SecondaryTextBlock className="course-name">{t('certificate.title')}</SecondaryTextBlock>
			</Container>
		</WrapperComponent>
	);
};

export default translate()(CourseChip);
