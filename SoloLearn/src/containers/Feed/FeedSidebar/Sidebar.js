import React from 'react';
import { connect } from 'react-redux';
import { discoverIdsSelector, discoverEntitiesSelector } from 'reducers/discover.reducer';
import { FlexBox } from 'components/atoms';
import DiscoverPeers from './DiscoverPeers';
import ProfileInfo from './ProfileInfo';
import './sidebar.scss';

const mapStateToProps = state => ({
	discoverIds: discoverIdsSelector(state),
	discoverEntities: discoverEntitiesSelector(state),
	userProfile: state.userProfile,
	levels: state.levels,
});

const Sidebar = ({
	discoverIds, discoverEntities, userProfile, levels,
}) => {
	if (userProfile === null) {
		return null;
	}
	return (
		<FlexBox column justify className="feed-sidebar">
			{
				userProfile &&
				<ProfileInfo profile={userProfile} levels={levels} />
			}
			<DiscoverPeers discoverEntities={discoverEntities} discoverIds={discoverIds} />
		</FlexBox>
	);
};

export default connect(mapStateToProps)(Sidebar);
