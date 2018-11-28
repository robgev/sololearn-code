import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Heading, SecondaryTextBlock, Title, FlexBox, List } from 'components/atoms';
import { ViewMoreLink } from 'components/molecules';
import RaisedButton from 'material-ui/RaisedButton';
import { sidebarCodesSelector } from 'reducers/codes.reducer';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';

import { CodeItem, AddCodeButton } from '../components';
import './styles.scss';

const mapStateToProps = state => ({
	userID: state.userProfile.id,
	sidebarItems: sidebarCodesSelector(state),
});

const PlaygroundSidebar = ({ t, sidebarItems, userID }) => (
	<Container className="playground_sidebar">
		<Heading>{t('code.filter.my-codes')}</Heading>
		{sidebarItems === null
			? <SidebarShimmer round noTitle />
			:	sidebarItems.length === 0
				?	(
					<FlexBox column justify align>
						<Title className="item title">{t('code.no-saved-code-title')}</Title>
						<SecondaryTextBlock className="item">{t('code.no-saved-code-message')}</SecondaryTextBlock>
						<AddCodeButton>
							{({ togglePopup }) =>
								(
									<RaisedButton
										secondary
										onClick={togglePopup}
										label={t('code.no-saved-code-action-title')}
									/>
								)
							}
						</AddCodeButton>
					</FlexBox>
				)
				: (
					<List>
						{sidebarItems.map(code => <CodeItem key={code.id} code={code} />)}
					</List>
				)
		}
		{sidebarItems && sidebarItems.length > 0 &&
			<ViewMoreLink to={`/profile/${userID}/codes`} >
				{t('common.loadMore')}
			</ViewMoreLink>
		}
	</Container>
);

export default connect(mapStateToProps)(translate()(PlaygroundSidebar));
