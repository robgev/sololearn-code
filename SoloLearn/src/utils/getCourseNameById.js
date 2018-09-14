const getCourseNameById = (courses, id) => {
	const foundCourse = courses.find(course => course.id === id);
	return foundCourse.alias;
};

export default getCourseNameById;
