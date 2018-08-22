const isObjectEqual = (obj1, obj2) => {
	let isEqual = true;
	Object.keys(obj1).forEach((key) => {
		if (obj2[key] !== obj1[key]) {
			isEqual = false;
		}
	});
	return isEqual;
};

export default isObjectEqual;
