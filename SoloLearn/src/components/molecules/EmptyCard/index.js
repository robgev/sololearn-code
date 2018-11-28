import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import { Loading, PaperContainer, FlexBox, TextBlock } from 'components/atoms';

const EmptyCard = ({ t, loading, paper }) => {
	const Wrapper = paper ? PaperContainer : Fragment;
	return (
		<Wrapper>
			<FlexBox justify align className="empty-card-placeholder">
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
