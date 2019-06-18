import moment from 'moment';
import 'moment/locale/ru';
import 'moment/locale/es';
import i18n from 'i18n';

const updateDate = (date) => {
	moment.locale(i18n.language);
	const postDate = moment.utc(date);
	const currentDate = moment.utc();
	const diffWeeks = currentDate.diff(postDate, 'weeks');

	if (diffWeeks > 4) {
		return postDate.format('ll');
	}
	return postDate.fromNow();
};

export const formatDate = (date) => {
	moment.locale(i18n.language);
	const postDate = moment.utc(date);
	return postDate.format('MMM D HH:mm');
};

export default updateDate;
