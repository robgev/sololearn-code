const getCourseAliasById = (courses, id) => {
	const foundCourse = courses.find(course => course.id === id);
	return foundCourse.alias;
};

export default getCourseAliasById;
