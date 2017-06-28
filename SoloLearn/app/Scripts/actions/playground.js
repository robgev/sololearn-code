import Service from '../api/service';
import * as types from '../constants/ActionTypes';

export const emptyCodes = () => {
    return dispatch => {
        return new Promise((resolve, reject) => {
            dispatch({
                type: types.EMPTY_CODES,
                payload: []
            });
            resolve();
        });
    }
}

export const getCodes = (codes) => {
    return {
        type: types.GET_CODES,
        payload: codes
    }
}

export const getProfileCodes = (codes) => {
    return {
        type: types.GET_PROFILE_CODES,
        payload: codes
    }
}

export const getCodesInternal = (index, orderBy, language, query, userId = null, count = 20) => {
    return dispatch => {
        return Service.request("Playground/GetPublicCodes", { index: index, count: count, orderBy: orderBy, language: language, query: query, profileId: userId }).then(response => {
            const codes = response.codes;

            if (userId != null) {
                dispatch(getProfileCodes(codes));
            }
            else {
                dispatch(getCodes(codes));
            }

            return codes.length;
        }).catch(error => {
            console.log(error);
        });
    }
}