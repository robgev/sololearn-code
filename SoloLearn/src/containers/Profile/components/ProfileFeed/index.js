import React, { useState } from 'react';
import { translate } from 'react-i18next';
import { Container, Popup } from 'components/atoms';
import { FloatingActionButton } from 'components/molecules';
import { Add } from 'components/icons';

import FeedList from 'containers/Feed/FeedList';
import UserPostEditor from 'containers/UserPostEditor';

import './styles.scss';

const ProfileFeed = ({
	feed,
	loading,
	hasMore,
	loadMore,
	voteFeedItem,
	showFab,
	appendFeedItem,
}) => {
	const [ hasNewItems, setHasNew ] = useState(false);
	const [ isCreatePostPopupOpen, toggleCreatePostPopup ] = useState(false);

	const loadNewFeedItems = (post) => {
		try {
			appendFeedItem(post);
			setHasNew(true);
		} catch (e) {
			console.log(e);
		}
	};

	const resetNewFlag = () => {
		setHasNew(false);
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
				<UserPostEditor
					afterPostCallback={loadNewFeedItems}
					closePopup={() => toggleCreatePostPopup(false)}
				/>
			</Popup>
		</Container>
	);
};

export default translate()(ProfileFeed);
