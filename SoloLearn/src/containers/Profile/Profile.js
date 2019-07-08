// React modules
import React, { useState, useEffect } from 'react';
import ReactGA from 'react-ga';
import { browserHistory } from 'react-router';
import { translate } from 'react-i18next';
import { connect } from 'react-redux';

import {
	filterExisting,
	groupFeedItems,
	showError,
	forceOpenFeed,
} from 'utils';
import feedTypes from 'defaults/appTypes';
import { CodesList, AddCodeButton } from 'containers/Playground/components';
import BusyWrapper from 'components/BusyWrapper';
import ProfileHeaderShimmer from 'components/Shimmers/ProfileHeaderShimmer';
import QuestionList, { AddQuestionButton } from 'containers/Discuss/QuestionsList';
import {
	Tabs,
	Tab,
	TextBlock,
	PaperContainer,
	Container,
} from 'components/atoms';
import { LayoutWithSidebar, InfiniteScroll, FloatingActionButton } from 'components/molecules';
import { Feed, Add } from 'components/icons';
import { ProfileFeed } from './components';
import 'containers/Discuss/QuestionsList/styles.scss';
import 'styles/Profile/index.scss';
import Header from './Header';
import Skills from './Skills';
import Badges from './Badges';
import FollowersBase from './FollowersBase';
import ProfileSidebar from './ProfileSidebar';
import SignInPopup from 'components/SignInPopup';

import {
	getFeed,
	getProfile,
	followUser,
	getCodes,
	getQuestions,
} from './profile.api';

const capitalize = str => str.charAt(0).toUpperCase() + str.substr(1);
const TABS = {
	codes: 'codes',
	discussion: 'discussion',
	activity: 'activity',
	skills: 'skills',
	badges: 'badges',
};

const Profile = ({
	params: { id, tab }, userId, location, levels, t,
}) => {
	const [ feed, setFeed ] = useState([]);
	const [ gettingFeed, setGettingFeed ] = useState(false);
	const [ data, setData ] = useState({});
	const [ gettingData, setGettingData ] = useState(false);
	const [ followerPopupOpen, setFollowerPopupOpen ] = useState(false);
	const [ feedHasMore, setFeedHasMore ] = useState(true);
	const [ feedGetMore, setFeedGetMore ] = useState(false);
	const [ openSigninPopup, setOpenSigninPopup ] = useState(false);

	const [ codes, setCodes ] = useState([]);
	const [ gettingCodes, setGettingCodes ] = useState(false);
	const [ codesHasMore, setCodesHasMore ] = useState(true);

	const [ questions, setQuestions ] = useState([]);
	const [ gettingQuestions, setGettingQuestions ] = useState(false);
	const [ questionsHasMore, setQuestionsHasMore ] = useState(true);

	useEffect(() => {
		if (!id) {
			browserHistory.replace({
				...location,
				pathname: `/profile/${userId}/${TABS.activity}`,
			});
			return;
		}
		if (TABS[id]) { // if first parameter is tab name
			browserHistory.replace({
				...location,
				pathname: `/profile/${userId}/${id}/${TABS.activity}`,
			});
		}

		if (!tab) { // no tab specified
			browserHistory.replace({
				...location,
				pathname: `/profile/${id}/${TABS.activity}`,
			});
		}
	}, []);

	const feedFromId = () => {
		const lastItem = feed[feed.length - 1];
		return feed.length === 0
			? null
			: lastItem.type === feedTypes.mergedChallange
				? lastItem.groupedItems[lastItem.groupedItems.length - 1].id
				: lastItem.id;
	};
	
	const toggleSigninPopup=()=>{
		setOpenSigninPopup(!openSigninPopup);
	}

	const loadFeedItems = () => {
		if (gettingFeed || !feedHasMore) return;
		setGettingFeed(true);
		const count = 20;
		getFeed({ fromId: feedFromId(), profileId: id, count })
			.then(({ feed: newItems }) => {
				const feedItems = groupFeedItems(newItems);
				const isFirstItemGrouppedChallenge =
				feed.length === 0
						&& feedItems.length
						&& feedItems[0].type === feedTypes.mergedChallange;
				const forceOpenedFeed = isFirstItemGrouppedChallenge
					? forceOpenFeed(feedItems[0])
					: feedItems;
				const filtered = filterExisting(feed, forceOpenedFeed);
				setFeed([ ...feed, ...filtered ]);
				if (newItems.length < count) {
					setFeedHasMore(false);
				}
				setGettingFeed(false);
				const feedItemsCount = feed.length + forceOpenedFeed.length;
				if (feedItemsCount < count / 2 && feedHasMore) {
					const lastItem = forceOpenedFeed[forceOpenedFeed.length - 1];
					if (lastItem !== undefined) {
						setFeedGetMore(true);
					}
				}
			});
	};

	useEffect(() => {
		if (feedGetMore) {
			setFeedGetMore(false);
			loadFeedItems();
		}
	}, [ feedGetMore ]);

	useEffect(() => {
		setData({});
		setGettingData(true);
		setFeed([]);
		setCodes([]);
		setQuestions([]);
		getProfile(id).then(({ profile }) => {
			setData(profile);
			setGettingData(false);
		});
	}, [ id ]);

	useEffect(() => {
		if (feed.length === 0) {
			loadFeedItems();
		}
	}, [ feed ]);

	useEffect(() => {
		if (codes.length === 0) {
			loadCodes();
		}
	}, [ codes ]);

	useEffect(() => {
		if (questions.length === 0) {
			loadQuestions();
		}
	}, [ questions ]);

	const toggleFollowerPopup = () => {
		setFollowerPopupOpen(!followerPopupOpen);
	};
	const handleTabChange = (_, newTab) => {
		browserHistory.replace({
			...location,
			pathname: `/profile/${id}/${newTab}`,
		});
		ReactGA.ga('send', 'screenView', { screenName: `Profile ${capitalize(newTab)} Page` });
	};
	const onFollowUser = () => {
		if (!userId) {
			toggleSigninPopup();
		} else {
			followUser({ id: data.id, shouldFollow: !data.isFollowing });
			setData({ ...data, isFollowing: !data.isFollowing });
		}
	};
	const onVote = ({
		vote,
		newVote,
		id: feedItemId,
		votes: totalVotes,
	}) => {
		const userVote = vote === newVote ? 0 : newVote;
		const votes = (totalVotes + userVote) - vote;
		const feedItem = feed.find(i => i.id === feedItemId);
		feedItem.vote = userVote;
		feedItem.votes = votes;
		setFeed([ ...feed ]);
	};
	const appendFeedItem = (item) => {
		setFeed([ item, ...feed ]);
	};

	const loadCodes = () => {
		if (gettingCodes) return;
		setGettingCodes(true);
		const count = 20;
		getCodes({ index: codes.length, count, profileID: id })
			.then(({ codes: newCodes }) => {
				if (newCodes.length < count) {
					setCodesHasMore(false);
				}
				setCodes([ ...codes, ...newCodes ]);
				setGettingCodes(false);
			});
	};

	const loadQuestions = () => {
		if (gettingQuestions) return;
		setGettingQuestions(true);
		const count = 20;
		getQuestions({ index: questions.length, count, profileID: id })
			.then(({ posts }) => {
				if (posts.length < count) {
					setQuestionsHasMore(false);
				}
				setQuestions([ ...questions, ...posts ]);
				setGettingQuestions(false);
			});
	};

	return (
		<LayoutWithSidebar className="profile-container" sidebar={<ProfileSidebar />}>
			<PaperContainer className="profile-overlay">
				<BusyWrapper
					isBusy={gettingData}
					style={{ display: 'initial' }}
					loadingComponent={<ProfileHeaderShimmer />}
				>
					<Header
						levels={levels}
						profile={data}
						openFollowerPopup={toggleFollowerPopup}
						onFollow={onFollowUser}
						toggleSigninPopup={toggleSigninPopup}
					/>
					<Tabs
						value={tab}
						onChange={handleTabChange}
					>
						<Tab
							value={TABS.codes}
							label={<TextBlock>{t('profile.tab.codes')}</TextBlock>}
							icon={<TextBlock>{data.codes}</TextBlock>}
						/>
						<Tab
							value={TABS.discussion}
							label={<TextBlock>{t('profile.tab.posts')}</TextBlock>}
							icon={<TextBlock>{data.posts}</TextBlock>}
						/>
						<Tab
							value={TABS.activity}
							label={<TextBlock>{t('profile.tab.activity')}</TextBlock>}
							icon={<Feed className="feed-icon" />}
						/>
						<Tab
							value={TABS.skills}
							label={<TextBlock>{t('profile.tab.skills')}</TextBlock>}
							icon={
								<TextBlock>
									{data.skills ? data.skills.length : 0}
								</TextBlock>
							}
						/>
						<Tab
							value={TABS.badges}
							label={<TextBlock>{t('profile.tab.badges')}</TextBlock>}
							icon={
								<TextBlock>
									{data.badges ? data.badges.filter(item => item.isUnlocked).length : 0}
								</TextBlock>
							}
						/>
					</Tabs>
				</BusyWrapper>
			</PaperContainer>
			{
				tab === TABS.activity &&
				<ProfileFeed
					feed={feed}
					hasMore={feedHasMore}
					showFab={id === userId}
					loadMore={loadFeedItems}
					voteFeedItem={onVote}
					loading={gettingFeed}
					appendFeedItem={appendFeedItem}
				/>
			}
			{
				tab === TABS.codes &&
					<InfiniteScroll
						hasMore={codesHasMore}
						isLoading={gettingCodes}
						loadMore={loadCodes}
					>
						<PaperContainer className={`codes-wrapper section ${!codesHasMore && 'wrapper-end'}`}>
							<CodesList
								codes={codes}
								hasMore={codesHasMore}
							/>
							{data.id === userId &&
								<AddCodeButton>
									{({ togglePopup }) => <FloatingActionButton alignment="right" onClick={togglePopup} ><Add /></FloatingActionButton>}
								</AddCodeButton>
							}
						</PaperContainer>
					</InfiniteScroll>
			}
			{
				tab === TABS.discussion && (
					<InfiniteScroll
						hasMore={questionsHasMore}
						isLoading={gettingQuestions}
						loadMore={loadQuestions}
					>
						<PaperContainer className={`discuss_questions-list ${!questionsHasMore && 'wrapper-end'}`}>
							<QuestionList
								fromProfile
								questions={questions}
								hasMore={questionsHasMore}
							/>
							{data.id === userId &&
							<AddQuestionButton />
							}
						</PaperContainer>
					</InfiniteScroll>
				)
			}
			{
				tab === TABS.skills &&
					<Skills
						levels={levels}
						profile={data}
						currentUserId={userId}
						skills={data.skills}
					/>
			}
			{
				tab === TABS.badges && data.badges &&
					<Badges
						badges={data.badges}
						key={location.query.badgeID || 0}
						selectedId={location.query.badgeID || 0}
					/>
			}
			<FollowersBase
				open={followerPopupOpen}
				userId={id}
				isLoggedIn={userId}
				closePopup={toggleFollowerPopup}
				toggleSigninPopup={toggleSigninPopup}
			/>
			<SignInPopup
				open={openSigninPopup}
				url={`/profle/${data.id}`}
				onClose={toggleSigninPopup}
			/>
		</LayoutWithSidebar>
	);
};

const mapStateToProps = state => ({
	levels: state.levels,
	userId: state.userProfile ? state.userProfile.id : 0,
});

export default translate()(connect(mapStateToProps)(Profile));
