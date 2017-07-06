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
                return item.player.status == contestTypes.Won || item.player.status == contestTypes.Lost || item.player.status == contestTypes.Draw
                    || item.player.status == contestTypes.Expired || item.player.status == contestTypes.GotDeclined;
            });

            const ongoingChallenges = contestsFeed.filter(item => item.player.status == contestTypes.Started || item.player.status == contestTypes.Challenged);

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
            dispatch({
                type: types.CLEAR_CONTESTS,
                payload: null
            });
            resolve();
        });
    }
}

export const clearContestsInternal = () => {
    return dispatch => {
        dispatch(clearContests()).then(() => {
            //Service.request("");
        }).catch((error) => {
            console.log(error);
        });
    }
}