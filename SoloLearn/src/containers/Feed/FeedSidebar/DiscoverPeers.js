import React, { Fragment } from 'react';
import { translate } from 'react-i18next';
import { numberFormatter } from 'utils';
import {
	Container, FlexBox, HorizontalDivider, PaperContainer,
	List, ListItem, SecondaryTextBlock, Heading,
} from 'components/atoms';
import { UsernameLink, ViewMoreLink, ProfileAvatar, ModBadge } from 'components/molecules';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';

const DiscoverPeers = ({ t, discoverEntities, discoverIds }) => (
	<PaperContainer className="discover-peers">
		<Heading>{t('discover_peers.title')}</Heading>
		{discoverEntities === null
			? <SidebarShimmer round noTitle />
			: (
				<List>
					{
						discoverIds.slice(0, 7).map((id) => {
							const {
								name, followers, level, badge,
							} = discoverEntities[id];
							return (
								<Fragment>
									<ListItem>
										<FlexBox>
											<ProfileAvatar
												className="profile"
												user={discoverEntities[id]}
											/>
											<FlexBox column className="profile-info">
												<Container>
													<UsernameLink to={`/profile/${id}`} >{name}</UsernameLink>
													<ModBadge
														className="badge"
														badge={badge}
													/>
												</Container>
												<SecondaryTextBlock>
													{
														followers === 1
															? `1 ${t('user-followers-one')}`
															: `${numberFormatter(followers)} ${t('common.user-followers')}`
													} | {t('common.user-level')} {numberFormatter(level)}
												</SecondaryTextBlock>
											</FlexBox>
										</FlexBox>
									</ListItem>
									<HorizontalDivider />
								</Fragment>
							);
						})
					}
				</List>
			)
		}
		{discoverEntities && discoverIds.length > 0 &&
			<ViewMoreLink className="feed-sidebar_view-more" to="/discover">
				{t('common.loadMore')}
			</ViewMoreLink>
		}
	</PaperContainer>
);

export default translate()(DiscoverPeers);
