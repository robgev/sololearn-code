import * as types from '../constants/ActionTypes';

export const selectTab = tab => ({
        type: types.TAB_SELECTED,
        payload: tab
    });