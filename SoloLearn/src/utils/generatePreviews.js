const createPreviewData = ({ message, regexp, type }) => {
	const regex = new RegExp(regexp);
	const matchedLinks = message.match(regex);
	if (matchedLinks) {
		return matchedLinks.map((singleLink) => {
			const groups = new RegExp(regex).exec(singleLink);
			// groups[0] is the whole string, [1] is the first capture group and so on.
			return type === 'course' ? {
				type,
				link: singleLink,
				id: groups[2],
				courseAlias: groups[1],
			} : {
				type,
				id: groups[1],
				link: singleLink,
			};
		});
	}
	return [];
};

const generatePreviews = (message) => {
	const lessonRegex = /https?:\/\/(?:www\.)?sololearn\.com\/learn\/(\d+)\/?\??.*/gi;
	const courseRegex = /https?:\/\/(?:www\.)?sololearn\.com\/(?:learn|course|courses)\/([A-Za-z_]+)(?:\/(\d+))?\/?\??.*/gi;
	const codeRegex = /https?:\/\/code\.sololearn\.com\/([a-zA-Z0-9]{10,})/gi;
	const discussRegex = /https?:\/\/(?:www\.)?sololearn\.com\/discuss\/(\d+)/gi;
	const userPostRegex = /https?:\/\/(?:www\.)?sololearn\.com\/post\/(\d+)/gi;
	const profileRegex = /https?:\/\/(?:www\.)?sololearn\.com\/profile\/(\d+)/gi;

	const lessonPreviewData = createPreviewData({ message, regexp: lessonRegex, type: 'slayLesson' });
	const codePreviewData = createPreviewData({ message, regexp: codeRegex, type: 'code' });
	const discussPreviewData = createPreviewData({ message, regexp: discussRegex, type: 'discuss' });
	const coursePreviewData = createPreviewData({ message, regexp: courseRegex, type: 'course' });
	const userPostPreviewData = createPreviewData({ message, regexp: userPostRegex, type: 'userPost' });
	const profilePreviewData = createPreviewData({ message, regexp: profileRegex, type: 'profile' });

	return [
		...lessonPreviewData,
		...codePreviewData,
		...discussPreviewData,
		...coursePreviewData,
		...userPostPreviewData,
		...profilePreviewData,
	];
};

export default generatePreviews;
