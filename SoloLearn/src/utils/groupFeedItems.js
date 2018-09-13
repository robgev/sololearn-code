import feedTypes from 'defaults/appTypes';

const groupAllChallengesByUser = (searchedFeedItems, currentItem) => {
	const allChallenges = searchedFeedItems.filter(currentlyCheckedItem =>
		currentlyCheckedItem.type === feedTypes.completedChallange &&
		currentlyCheckedItem.contest.player.id === currentItem.contest.player.id);
	if (allChallenges.length > 1) {
		const challengesCount = allChallenges.length;
		return {
			id: allChallenges[challengesCount - 1].id,
			toId: currentItem.id,
			date: currentItem.date,
			title: `has completed ${challengesCount} challenges`,
			user: currentItem.user,
			groupedItems: allChallenges,
			type: 444,
		};
	}
	return currentItem;
};

export const forceOpenFeed = (firstFeedItem) => {
	const forceOpenedItems = firstFeedItem.groupedItems.slice(0, 5);
	const modifiedMergedChallengeGroup = firstFeedItem.groupedItems.length <= 5 ? [] : [ {
		...firstFeedItem,
		toId: firstFeedItem.groupedItems[5].id,
		date: firstFeedItem.groupedItems[5].date,
		title: `has completed ${firstFeedItem.groupedItems.length - 5} challenges`,
		groupedItems: firstFeedItem.groupedItems.slice(5),
	} ];
	const result = [ ...forceOpenedItems, ...modifiedMergedChallengeGroup ];
	return result;
};

export default (feedItems) => {
	const reducedItems =
		feedItems.reduce(({ groupedItems, checkedChallengers }, feedItem, currentIndex) => {
			if (feedItem.type !== feedTypes.completedChallange) {
				const newGroup = [ ...groupedItems, feedItem ];
				return {
					checkedChallengers,
					groupedItems: newGroup,
				};
			}
			const playerID = feedItem.contest.player.id;
			const isUserChallengesAlreadyGrouped = checkedChallengers.includes(playerID);
			if (!isUserChallengesAlreadyGrouped) {
				const searchArray = feedItems.slice(currentIndex);
				const allChallengesByCurrentChallenger =
					groupAllChallengesByUser(searchArray, feedItem);
				const newCheckedChallengersList = [ ...checkedChallengers, playerID ];
				const newGroup = [ ...groupedItems, allChallengesByCurrentChallenger ];
				return {
					groupedItems: newGroup,
					checkedChallengers: newCheckedChallengersList,
				};
			}

			return {
				groupedItems,
				checkedChallengers,
			};
		}, { groupedItems: [], checkedChallengers: [] });

	return reducedItems.groupedItems;
};
