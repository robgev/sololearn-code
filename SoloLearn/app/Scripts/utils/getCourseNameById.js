import toSeoFriendly from './linkPrettify';

const getCourseNameById = (courses, id) => {
	const foundCourse = courses.find(course => course.id === id);
	return toSeoFriendly(foundCourse.name, 100);
};

export default getCourseNameById;
