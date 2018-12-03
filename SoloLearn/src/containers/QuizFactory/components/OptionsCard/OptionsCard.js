import React from 'react';
import PropTypes from 'prop-types';
import {
	PaperContainer, FlexBox,
	Title, SecondaryTextBlock, Image,
} from 'components/atoms';
import { ContainerLink } from 'components/molecules';

import './OptionsCard.scss';

const OptionsCard = ({
	image, header, info, to, onClick,
}) => (
	<ContainerLink
		onClick={onClick !== null
			? (e) => {
				e.preventDefault();
				onClick();
			}
			: () => { }}
		to={to}
	>
		<PaperContainer className="options-card">
			<FlexBox>
				<FlexBox>
					<Image src={image} alt="" />
				</FlexBox>
				<FlexBox column>
					<Title>{header}</Title>
					<SecondaryTextBlock>{info}</SecondaryTextBlock>
				</FlexBox>
			</FlexBox>
		</PaperContainer>
	</ContainerLink>
);

OptionsCard.defaultProps = {
	onClick: null,
};

OptionsCard.propTypes = {
	image: PropTypes.string.isRequired,
	header: PropTypes.string.isRequired,
	info: PropTypes.string.isRequired,
	to: PropTypes.string.isRequired,
	onClick: PropTypes.func,
};

export default OptionsCard;
