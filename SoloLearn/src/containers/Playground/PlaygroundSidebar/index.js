import React from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Heading, SecondaryTextBlock, Title, FlexBox, List, PaperContainer, ListItem, Link } from 'components/atoms';
import { ViewMoreLink, RaisedButton, UsernameLink, ModBadge, ViewStats } from 'components/molecules';
import { sidebarCodesSelector } from 'reducers/codes.reducer';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';

import ProfileInfo from 'containers/Feed/FeedSidebar/ProfileInfo';

import LanguageCard from 'components/LanguageCard';

import { AddCodeButton } from '../components';
import './styles.scss';

const mapStateToProps = state => ({
	userID: state.userProfile.id,
	sidebarItems: sidebarCodesSelector(state),
	userProfile: state.userProfile,
	levels: state.levels,
});

const PlaygroundSidebar = ({
	t, sidebarItems, userID, userProfile, levels,
}) => (
	<FlexBox column className="playground_sidebar">
		<ProfileInfo profile={userProfile} levels={levels} />
		<PaperContainer>
			<Heading>{t('code.filter.hot-today')}</Heading>
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
											color="secondary"
											onClick={togglePopup}
										>
											{t('code.no-saved-code-action-title')}
										</RaisedButton>
									)
								}
							</AddCodeButton>
						</FlexBox>
					)
					: (
						<List>
							{sidebarItems.map(code =>
								(
									<ListItem key={code.id} className="hot-today-item">
										<FlexBox>
											<FlexBox>
												<LanguageCard language={code.language} />
											</FlexBox>
											<FlexBox column>
												<FlexBox column className="hot-today-content">
													<Link to={`/playground/${code.publicID}`} className="hot-today-question">
														{code.name}
													</Link>
													<FlexBox className="author-name-container">
														<UsernameLink className="author-name" to={`/profile/${code.userID}`}>{code.userName}</UsernameLink>
														<ModBadge
															className="badge"
															badge={code.badge}
														/>
													</FlexBox>
												</FlexBox>
												<FlexBox>
													<ViewStats
														small
														votes={code.votes}
														comments={code.comments}
														views={code.viewCount}
													/>
												</FlexBox>
											</FlexBox>
										</FlexBox>
									</ListItem>
								))}
						</List>
					)
			}

		</PaperContainer>
	</FlexBox>
);

export default connect(mapStateToProps)(translate()(PlaygroundSidebar));
