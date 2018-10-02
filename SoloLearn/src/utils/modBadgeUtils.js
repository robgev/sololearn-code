export default (rawBadge) => {
	if (!rawBadge) {
		return {
			isPro: false,
			modBadge: null,
			levelBadge: null,
		};
	}
	const splittedBadge = rawBadge.split('|');
	const modBadge = (splittedBadge.length > 1 && splittedBadge[1].includes('mod')) ? splittedBadge[1] : null;
	const isPro = splittedBadge.length > 1 && splittedBadge[1] === 'pro';
	const levelBadge = splittedBadge[0];
	return {
		isPro,
		modBadge,
		levelBadge,
	};
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
