import * as types from '../constants/ActionTypes';

export function selectTab(tab) {
    return {
        type: types.TAB_SELECTED,
        payload: tab
    }
}