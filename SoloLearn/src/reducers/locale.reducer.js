import { RESET_LOCALE_DATA } from 'constants/ActionTypes';
import Storage from 'api/storage';

export default (state = Storage.load('locale') || 'en', action) =>
	(action.type === RESET_LOCALE_DATA
		? action.payload
		: state);
