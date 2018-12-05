import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import { Loading, PaperContainer, FlexBox, TextBlock } from 'components/atoms';

import './styles.scss';

const EmptyCard = ({
	t,
	loading,
	paper,
	className,
	...props
}) => {
	const Wrapper = paper ? PaperContainer : Fragment;
	return (
		<Wrapper>
			<FlexBox
				align
				justify
				className={`empty-card-placeholder ${className}`}
				{...props}
			>
				{loading
					? <Loading />
					: <TextBlock>{t('common.empty-list-message')}</TextBlock>
				}
			</FlexBox>
		</Wrapper>
	);
};

EmptyCard.defaultProps = {
	loading: false,
	paper: false,
};

export default translate()(EmptyCard);
