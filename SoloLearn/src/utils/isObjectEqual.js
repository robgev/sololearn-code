const isObjectEqual = (obj1, obj2) => {
	let isEqual = true;
	Object.keys(obj1).forEach((key) => {
		if (obj2[key] !== obj1[key]) {
			isEqual = false;
		}
	});
	Object.keys(obj2).forEach((key) => {
		if (obj1[key] !== obj2[key]) {
			isEqual = false;
		}
	});
	return isEqual;
};

export default isObjectEqual;
