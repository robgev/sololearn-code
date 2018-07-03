const getLanguageColor = (language) => {
	switch (language) {
	case 'js':
		return '#F0DA50';
	case 'cpp':
		return '#076390';
	case 'cs':
		return '#662E93';
	case 'java':
		return '#F99924';
	case 'py':
		return '#1E415E';
	case 'rb':
		return '#E14E40';
	case 'php':
		return '#5F83BB';
	case 'web':
		return '#E54D26';
	default:
		return '';
	}
};

export default getLanguageColor;
