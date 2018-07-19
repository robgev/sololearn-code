import * as types from 'constants/ActionTypes';

const selectTab = tab => ({
	type: types.TAB_SELECTED,
	payload: tab,
});

export default selectTab;
