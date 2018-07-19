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
	case 'css':
		return '#24ABE2';
	case 'web':
		return '#E54D26';
	case 'html':
		return '#F26525';
	case 'c':
		return '#1482B7';
	case 'kt':
		return '#3495D8';
	case 'swift':
		return '#F57B38';
	default:
		return '';
	}
};

export default getLanguageColor;
