import { MAP_MODULES } from 'constants/ActionTypes';
import { toSeoFriendly } from 'utils';

export default function (state = null, action) {
	switch (action.type) {
	case MAP_MODULES:
		return action.payload;
	default:
		return state;
	}
}

export const getModuleByName = (state, name) => {
	const { modulesMapping } = state;
	if (modulesMapping === null) {
		return null;
	}
	let res = null;
	Object.values(state.modulesMapping).forEach((module) => {
		if (toSeoFriendly(module.name) === toSeoFriendly(name)) {
			res = module;
		}
	});
	return res;
};
