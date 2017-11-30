import moment from 'moment';

const updateDate = (date) => {
	const postDate = moment.utc(date);
	const currentDate = moment.utc();
	const diffWeeks = currentDate.diff(postDate, 'weeks');

	if (diffWeeks > 4) {
		return postDate.format('Do MMMM YYYY');
	}
	return currentDate.diff(postDate) <= 0
		? 'a few seconds ago'
		: postDate.fromNow();
};

export default updateDate;
