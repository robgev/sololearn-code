import React from 'react';
import { connect } from 'react-redux';
import ProfileAvatar from './ProfileAvatar';
import SidebarShimmer from 'components/Shimmers/SidebarShimmer';
import { numberFormatter } from 'utils';
import { discoverIdsSelector, discoverEntitiesSelector } from 'reducers/discover.reducer.js';
import {
	Container,
	Title,
	Link,
	SecondaryTextBlock,
} from 'components/atoms';
import { FlatButton, UsernameLink, } from 'components/molecules';

import 'styles/Feed/FeedSidebar.scss';

const mapStateToProps = state => ({
	discoverIds: discoverIdsSelector(state),
	discoverEntities: discoverEntitiesSelector(state),
});

const FeedSuggestions = ({ t, discoverIds, discoverEntities }) => (
	<Container className="feed-sidebar-suggestions">
		<Container className="sidebar-title">
			<Title className="title">{t('discover_peers.title')}</Title>
		</Container>
		{discoverEntities === null
			? <SidebarShimmer round noTitle />
			: discoverIds.slice(0, 7).map((id) => {
				const {
					name, avatarUrl, followers, level,
				} = discoverEntities[id];
				return (
					<Container className="suggestion-container">
						<ProfileAvatar
							user={discoverEntities[id]}
						/>
						<Container className="user-info">
							<UsernameLink to={`/profile/${id}`} >{name}</UsernameLink>

							<SecondaryTextBlock className="user-meta-info">
								{
									followers === 1
										? `1 ${t('user-followers-one')}`
										: `${numberFormatter(followers)} ${t('common.user-followers')}`
								} | {t('common.user-level')} {numberFormatter(level)}
							</SecondaryTextBlock>
						</Container>
					</Container>
				);
			})}
		{ discoverEntities && discoverIds.length > 0 &&
			<Link className="load-more" to="/discover">
				<FlatButton>
					{t('common.loadMore')}
				</FlatButton>
			</Link>
		}
	</Container>
);

export default connect(mapStateToProps)(FeedSuggestions);
