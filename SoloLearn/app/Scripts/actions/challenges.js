import Service from '../api/service';
import * as types from '../constants/ActionTypes';

import contestTypes from '../defaults/contestTypes';

export const getContests = (contests) => {
    return {
        type: types.GET_CONTESTS,
        payload: contests
    }
}

export const getContestsInternal = () => {
    return dispatch => {
        return Service.request("Challenge/GetContestFeed").then(response => {
            const contestsFeed = response.feed;

            const completedChallenges = contestsFeed.filter(item => {
                return item.player.status == contestTypes.Won || item.player.status == contestTypes.Lost ||
                        item.player.status == contestTypes.Draw || item.player.status == contestTypes.Expired ||
                        item.player.status == contestTypes.GotDeclined;
            });

            const ongoingChallenges = contestsFeed.filter(item => item.player.status == contestTypes.Started ||
                                                                    item.player.status == contestTypes.Challenged);

            const invitedChallenges = contestsFeed.filter(item => item.player.status == contestTypes.GotChallenged);

            const structurizedContests = {
                "invited": invitedChallenges,
                "ongoing": ongoingChallenges,
                "completed": completedChallenges
            };

            dispatch(getContests(structurizedContests));
        }).catch(error => {
            console.log(error);
        });
    }
}

export const clearContests = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({ type: types.CLEAR_CONTESTS });
            resolve();
        });
    }
}

export const clearContestsInternal = () => {
    return dispatch => {
        return Service.request('Challenge/ClearContestResults')
            .then(() => dispatch(clearContests()))
            .catch((error) => {
                console.log(error);
            });
    }
}

export const chooseContestCourse = (courseId) => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.CHOOSE_CHALLENGE_COURSE,
                payload: courseId
            });
            resolve();
        });
    }
}

export const getAllPlayers = (players) => {
    return {
        type: types.GET_ALL_PLAYERS,
        payload: players
    }
}

export const getAllPlayersInternal = (name, courseId) => {
    return dispatch => {
        return Service.request("Challenge/FindPlayers", { name: name, courseId: courseId })
        .then(response => {
            dispatch(getAllPlayers(response.users));
        })
        .catch(error => {
            console.log(error);
        });
    }
}

export const emptyAllPlayers = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.EMPTY_ALL_PLAYERS
            });
            resolve();
        });
    }
}

export const getContest = (contest) => {
    return {
        type: types.GET_CONTEST,
        payload: contest
    }
}

export const createContestInternal = (opponentId) => {
    return (dispatch, getState) => {
        const store = getState();
        const { courseId } = store.challenges;

        return Service.request("Challenge/CreateContest", { courseId, opponentId })
        .then(response => {
            const contest = response.contest;
            dispatch(getContest(contest));
        })
        .catch(error => {
            console.log(error);
        });
    }
}

export const getContestInternal = (id) => {
    return dispatch => {
        return Service.request("Challenge/GetContest", { id })
            .then(response => {
                dispatch(getContest(response.contest));
            })
            .catch(error => {
                console.log(error);
            });
    }
}
