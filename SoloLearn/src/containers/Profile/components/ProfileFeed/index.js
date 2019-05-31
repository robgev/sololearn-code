import React, { useState } from 'react';
import { connect } from 'react-redux';
import { translate } from 'react-i18next';
import { Container, Popup } from 'components/atoms';
import { FloatingActionButton } from 'components/molecules';
import { Add } from 'components/icons';

import FeedList from 'containers/Feed/FeedList';
import UserPostEditor from 'containers/UserPostEditor';

import { getNewFeedItemsInternal } from 'actions/feed';

import './styles.scss';

const ProfileFeed = ({
	feed,
	loading,
	hasMore,
	loadMore,
	voteFeedItem,
	showFab,
	getNewFeedItemsInternal,
}) => {
	const [ hasNewItems, setHasNew ] = useState(false);
	const [ isCreatePostPopupOpen, toggleCreatePostPopup ] = useState(false);

	const loadNewFeedItems = async () => {
		try {
			const count = await getNewFeedItemsInternal();
			if (!hasNewItems && count > 0) {
				setHasNew(true);
			}
		} catch (e) {
			console.log(e);
		}
	};

	const resetNewFlag = () => {
		this.setState({ hasNewItems: false });
	};

	return (
		<Container className="profile-feed-container">
			<FeedList
				feed={feed}
				hasMore={hasMore}
				loading={loading}
				loadMore={loadMore}
				hasNewItems={hasNewItems}
				voteFeedItem={voteFeedItem}
				resetNewFlag={resetNewFlag}
			/>
			{showFab &&
				<FloatingActionButton
					color="secondary"
					alignment="right"
					onClick={() => toggleCreatePostPopup(true)}
				>
					<Add />
				</FloatingActionButton>
			}
			<Popup
				open={isCreatePostPopupOpen}
				onClose={() => toggleCreatePostPopup(false)}
			>
				<UserPostEditor closePopup={() => toggleCreatePostPopup(false)} updateListItems={loadNewFeedItems} />
			</Popup>
		</Container>
	);
};

export default translate()(connect(null, { getNewFeedItemsInternal })(ProfileFeed));
