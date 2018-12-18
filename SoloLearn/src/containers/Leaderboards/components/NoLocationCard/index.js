import React from 'react';
import { translate } from 'react-i18next';
import { SecondaryTextBlock, Title, FlexBox } from 'components/atoms';
import { RaisedButton, ContainerLink } from 'components/molecules';

import './styles.scss';

const NoLocationCard = ({ t }) => (
	<FlexBox className="no-location_container" column justify align>
		<Title className="no-location_spaced">{t('leaderboard.no-country-specified-title')}</Title>
		<SecondaryTextBlock className="no-location_spaced">{t('leaderboard.no-country-specified-message')}</SecondaryTextBlock>
		<ContainerLink to="/settings/profile">
			<RaisedButton color="secondary">
				{t('leaderboard.no-country-specified-action')}
			</RaisedButton>
		</ContainerLink>
	</FlexBox>
);

export default translate()(NoLocationCard);
