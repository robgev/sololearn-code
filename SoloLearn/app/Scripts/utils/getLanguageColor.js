const getLanguageColor = (language) => {
	switch (language) {
	case 'cpp':
		return '#076390';
	case 'cs':
		return '#662E93';
	case 'java':
		return '#f99924';
	case 'py':
		return '#1e415e';
	case 'rb':
		return '#e14e40';
	case 'php':
		return '#5f83bb';
	case 'web':
		return '#e54d26';
	}
};

export default getLanguageColor;
