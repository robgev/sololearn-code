// React modules
import React, { Component, useState, useEffect } from 'react';
import { translate } from 'react-i18next';
import ReactGA from 'react-ga';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';
import {
	Container,
	Popup,
	PopupTitle,
	PopupContent,
	PopupContentText,
	Tabs,
	Tab,
} from 'components/atoms';
import UserList from './UserList';
import { getFollowing, getFollowers, followUser } from './profile.api';

import './FollowersBase.scss';

const TabTypes = {
	Followers: 1,
	Following: 2,
};

const FollowersBase = ({
	t, open, closePopup, userId,
}) => {
	const [ activeTab, setActiveTab ] = useState(TabTypes.Followers);
	const [ followers, setFollowers ] = useState([]);
	const [ followersLoading, setFollowersLoading ] = useState(false);
	const [ followersHasMore, setFollowersHasMore ] = useState(true);
	const [ following, setFollowing ] = useState([]);
	const [ followingLoading, setFollowingLoading ] = useState(false);
	const [ followingHasMore, setFollowingHasMore ] = useState(true);

	const handleTabChange = (_, tab) => {
		setActiveTab(tab);
	};

	const loadFollowing = () => {
		if (followingLoading) return;
		setFollowingLoading(true);
		const count = 20;
		getFollowing({ id: userId, index: following.length, count })
			.then(({ users }) => {
				if (users.length < count) {
					setFollowingHasMore(false);
				}
				setFollowing([ ...following, ...users ]);
				setFollowingLoading(false);
			});
	};

	const loadFollowers = () => {
		if (followersLoading) return;
		setFollowersLoading(true);
		const count = 20;
		getFollowers({ id: userId, index: followers.length, count })
			.then(({ users }) => {
				if (users.length < count)	{
					setFollowersHasMore(false);
				}
				setFollowers([ ...followers, ...users ]);
				setFollowersLoading(false);
			});
	};

	useEffect(() => {
		loadFollowers();
		loadFollowing();
	}, []);

	const onFollow = (id, isFollowing) => {
		followUser({ id, shouldFollow: !isFollowing });
		followers.findIndex(f => f.id === id && ((f.isFollowing = !isFollowing) || true));
		setFollowers([ ...followers ]);
		following.findIndex(f => f.id === id && ((f.isFollowing = !isFollowing) || true));
		setFollowing([ ...following ]);
	};

	return (
		<Popup
			open={open}
			onClose={closePopup}
			autoScrollBodyContent
			className="followers-popup"
		>
			<PopupTitle>
				<Tabs
					value={activeTab}

					onChange={handleTabChange}
				>
					<Tab
						label={t('followers.tab.followers-title')}
						value={TabTypes.Followers}
					/>
					<Tab
						label={t('common.user-following')}
						value={TabTypes.Following}
					/>
				</Tabs>
			</PopupTitle>
			<PopupContent>
				<PopupContentText>
					<Container className="followers-popup-conent">
						{activeTab === TabTypes.Followers &&
							<UserList
								users={followers}
								hasMore={followersHasMore}
								loadMore={loadFollowers}
								onFollowClick={onFollow}
								loading={followersLoading}
							/>
						}
						{activeTab === TabTypes.Following &&
							<UserList
								users={following}
								hasMore={followingHasMore}
								loadMore={loadFollowing}
								loading={followingLoading}
								onFollowClick={onFollow}
							/>
						}
					</Container>
				</PopupContentText>
			</PopupContent>
		</Popup>
	);
};

export default translate()(FollowersBase);
