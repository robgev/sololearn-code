const getLanguageColor = (language) => {
    switch(language) {
        case 'cpp': 
            return '#076390';
            break;
        case 'cs': 
            return '#662E93';
            break;
        case 'java': 
            return '#f99924';
            break;
        case 'py':
            return '#1e415e';
            break;
        case 'rb':
            return '#e14e40';
            break;
        case 'php':
            return '#5f83bb';
            break;
        case 'web':
            return '#e54d26';
            break;
    }
}

export default getLanguageColor;
