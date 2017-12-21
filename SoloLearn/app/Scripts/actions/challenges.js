import { browserHistory } from 'react-router';
import Service from 'api/service';
import * as types from 'constants/ActionTypes';

import contestTypes from 'defaults/contestTypes';

export const setContests = contests => ({
	type: types.SET_CONTESTS,
	payload: contests,
});

export const getContests = () => dispatch =>
	Service.request('Challenge/GetContestFeed')
		.then((response) => {
			const contestsFeed = response.feed;

			const completedChallenges = contestsFeed.filter(item =>
				item.player.status === contestTypes.Won ||
				item.player.status === contestTypes.Lost ||
				item.player.status === contestTypes.Draw ||
				item.player.status === contestTypes.Expired ||
				item.player.status === contestTypes.GotDeclined);

			const ongoingChallenges = contestsFeed.filter(item =>
				item.player.status === contestTypes.Started ||
				item.player.status === contestTypes.Challenged);

			const invitedChallenges = contestsFeed.filter(item =>
				item.player.status === contestTypes.GotChallenged);

			const structurizedContests = {
				invited: invitedChallenges,
				ongoing: ongoingChallenges,
				completed: completedChallenges,
			};

			dispatch(setContests(structurizedContests));
		})
		.catch((error) => {
			console.log(error);
		});

export const clearContests = () => dispatch =>
	new Promise((resolve) => {
		dispatch({ type: types.CLEAR_CONTESTS });
		resolve();
	});

export const clearContestsInternal = () => dispatch =>
	Service.request('Challenge/ClearContestResults')
		.then(() => dispatch(clearContests()))
		.catch((error) => {
			console.log(error);
		});

export const chooseContestCourse = courseId => ({
	type: types.CHOOSE_CHALLENGE_COURSE,
	payload: courseId,
});

export const getAllPlayers = players => ({
	type: types.GET_ALL_PLAYERS,
	payload: players,
});

export const getAllPlayersInternal = (name, courseId) => dispatch =>
	Service.request('Challenge/FindPlayers', { name, courseId })
		.then((response) => {
			dispatch(getAllPlayers(response.users));
		})
		.catch((error) => {
			console.log(error);
		});

export const emptyAllPlayers = () => dispatch =>
	new Promise((resolve) => {
		dispatch({
			type: types.EMPTY_ALL_PLAYERS,
		});
		resolve();
	});

export const setContest = contest => ({
	type: types.SET_CONTEST,
	payload: contest,
});

export const createContestInternal = opponentId => (dispatch, getState) => {
	const store = getState();
	const { courseId } = store.challenges;

	return Service.request('Challenge/CreateContest', { courseId, opponentId })
		.then((response) => {
			const { contest } = response;
			dispatch(setContest(contest));
			browserHistory.push(`/challenge/${contest.id}`);
		})
		.catch((error) => {
			console.log(error);
		});
};

export const getContest = id => dispatch =>
	Service.request('Challenge/GetContest', { id })
		.then((response) => {
			dispatch(setContest(response.contest));
		})
		.catch((error) => {
			console.log(error);
		});
