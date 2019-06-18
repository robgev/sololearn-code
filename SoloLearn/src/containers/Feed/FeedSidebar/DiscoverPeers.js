import React, { Fragment } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { followSuggestion } from 'actions/discover';
import { numberFormatter } from 'utils';
import {
	Container, FlexBox, HorizontalDivider, PaperContainer,
	List, ListItem, SecondaryTextBlock, Heading, TextBlock,
} from 'components/atoms';
import { UsernameLink, ViewMoreLink, ProfileAvatar, ModBadge, FlatButton } from 'components/molecules';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';

const DiscoverPeers = ({
	t, discoverEntities, discoverIds, followSuggestion,
}) => (
	<PaperContainer className="discover-peers">
		<Heading className="discover-peers-heading">{t('discover_peers.title')}</Heading>
		{discoverEntities === null
			? <SidebarShimmer className="discover-peers-shimmer" round noTitle />
			: (
				<List className="discover-peers-list">
					{
						discoverIds.slice(0, 7).map((id) => {
							const {
								name, followers, badge, isFollowing,
							} = discoverEntities[id];
							return (
								<Fragment>
									<ListItem className="discover-peers-li">
										<FlexBox>
											<ProfileAvatar
												className="profile"
												user={discoverEntities[id]}
											/>
											<FlexBox column className="discover-profile-info profile-info">
												<FlexBox align >
													<Container className="profile-name">
														<UsernameLink className="name" to={`/profile/${id}`} >
															{name}
														</UsernameLink>
														<ModBadge
															className="badge"
															badge={badge}
														/>
													</Container>
													<SecondaryTextBlock className="followers">
														<img src="/assets/ic_followers.png" alt="folowerImg" className="follower-icon" />
														{
															followers === 1
																? '1'
																: `${numberFormatter(followers)} `
														}
													</SecondaryTextBlock>
												</FlexBox>
												<FlatButton
													className="follow-button"
													onClick={() => { followSuggestion({ id, isFollowing }); }}
												>
													{isFollowing ? t('common.user-following') : t('common.follow-user')}
												</FlatButton>
											</FlexBox>
										</FlexBox>
									</ListItem>
									{/* <HorizontalDivider /> */}
								</Fragment>
							);
						})
					}
				</List>
			)
		}
		<HorizontalDivider />
		{discoverEntities && discoverIds.length > 0 &&
			<FlexBox align justify>
				<ViewMoreLink className="feed-sidebar_view-more" to="/discover">
					See more{/* Must be translated text {t('common.loadMore')} */}
				</ViewMoreLink>
			</FlexBox>
		}
	</PaperContainer>
);

const mapDispatchToProps = {
	followSuggestion,
};

export default translate()(connect(null, mapDispatchToProps)(DiscoverPeers));
