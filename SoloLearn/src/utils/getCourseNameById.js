const getCourseNameById = (courses, id) => {
	const foundCourse = courses.find(course => course.id === id);
	return foundCourse.name;
};

export default getCourseNameById;
