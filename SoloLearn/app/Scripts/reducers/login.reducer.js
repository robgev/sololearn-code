import { IMITATE_LOGIN } from '../constants/ActionTypes';

export default (loggedin = true, action) => {
	switch (action.type) {
	case IMITATE_LOGIN:
		return !loggedin;
	default:
		return loggedin;
	}
};
