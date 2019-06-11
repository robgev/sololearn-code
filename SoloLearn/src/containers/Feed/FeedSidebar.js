import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import { numberFormatter } from 'utils';
import { discoverIdsSelector, discoverEntitiesSelector } from 'reducers/discover.reducer';
import {
	Container, FlexBox, Heading, HorizontalDivider,
	List, ListItem, SecondaryTextBlock,
} from 'components/atoms';
import { UsernameLink, ViewMoreLink, ProfileAvatar, ModBadge } from 'components/molecules';
import './sidebar.scss';

const mapStateToProps = state => ({
	discoverIds: discoverIdsSelector(state),
	discoverEntities: discoverEntitiesSelector(state),
});

const FeedSuggestions = ({ t, discoverIds, discoverEntities }) => (
	<FlexBox column justify className="feed-sidebar">
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
												<FlexBox align>
													<UsernameLink to={`/profile/${id}`} >{name}</UsernameLink>
													<ModBadge
														className="badge"
														badge={badge}
													/>
												</FlexBox>
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
	</FlexBox>
);

export default connect(mapStateToProps)(FeedSuggestions);
