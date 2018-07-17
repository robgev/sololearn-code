export default (rawBadge) => {
	if (!rawBadge) {
		return null;
	}
	const splittedBadge = rawBadge.split('|');
	return (splittedBadge.length > 1 && splittedBadge[1].includes('mod')) ? splittedBadge[1] : null;
};

export const determineBadgeColor = (badge) => {
	switch (badge) {
	case 'mod':
		return '#AFAFAF';
	case 'gold_mod':
		return '#F3C207';
	case 'platinum_mod':
		return '#5B8BA2';
	default:
		return 'transparent';
	}
};
