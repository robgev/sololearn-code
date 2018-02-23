import moment from 'moment';
import i18n from 'i18n';
const updateDate = (date) => {
	moment.locale(i18n.language);
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
