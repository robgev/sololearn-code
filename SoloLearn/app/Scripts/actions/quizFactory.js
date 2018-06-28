import { SET_SUGGESTION_CHALLENGE } from 'constants/ActionTypes';

export const setSuggestionChallenge = challenge => ({
	type: SET_SUGGESTION_CHALLENGE,
	payload: challenge,
});
