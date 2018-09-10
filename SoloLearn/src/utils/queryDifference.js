const queryDifference = (obj1, obj2) => {
	const res = {};
	Object.keys(obj1).forEach((key) => {
		if (obj2[key] != null
			&& (obj1[key] === null || obj2[key].toString() !== obj1[key].toString())) {
			res[key] = obj2[key];
		}
	});
	return res;
};

export default queryDifference;
