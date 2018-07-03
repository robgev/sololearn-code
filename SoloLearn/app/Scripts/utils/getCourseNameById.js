import toSeoFrendly from './linkPrettify';

const getCourseNameById = (courses, id) => {
	const foundCourse = courses.find(course => course.id === id);
	return toSeoFrendly(foundCourse.name, 100);
};

export default getCourseNameById;
