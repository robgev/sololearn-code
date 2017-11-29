const updateMessage = (message) => {
	const urlRegex = /((https?:\/\/)?(www\.)?[-a-zA-Z0-9@:%._\\+~#=]{2,256}\.[a-z]{2,6}\b([-a-zA-Z0-9@:%_\\+.~#?&//=]*))/gi;

	message = message.replace(/</g, '&lt;')
		.replace(/>/g, '&gt;')
		.replace(/\r\n/g, '<br/>')
		.replace(/\n/g, '<br/>');

	message = message.replace(urlRegex, (match1, match2) => {
		let link = match2;
		const hasHttp = match2.indexOf('http') === 0;

		if (!hasHttp) {
			const has3w = match2.indexOf('www') === 0;

			if (!has3w) {
				return match2;
			}

			link = `http://${match2}`;
		}

		return `<a href=${link} target="_blank" class="inner-link">${match2}</a>`;
	});

	return message;
};

export default updateMessage;
