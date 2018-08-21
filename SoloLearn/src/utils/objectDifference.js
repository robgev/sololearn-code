const objectDifference = (obj1, obj2) => {
	const res = {};
	Object.keys(obj1).forEach((key) => {
		if (obj2[key] !== undefined && obj2[key] !== obj1[key]) {
			res[key] = obj2[key];
		}
	});
	return res;
};

export default objectDifference;
