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
		return '#236A98';
	case 'rb':
		return '#DB3B2E';
	case 'php':
		return '#777AB7';
	case 'css':
		return '#24ABE2';
	case 'web':
		return '#E83C46';
	case 'html':
		return '#E83C46';
	case 'c':
		return '#1F82C7';
	case 'kt':
		return '#5D75E7';
	case 'swift':
		return '#F4741E';
	default:
		return '';
	}
};

export default getLanguageColor;
