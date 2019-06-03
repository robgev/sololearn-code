export default (rawBadge) => {
	if (!rawBadge) {
		return {
			isPro: false,
			modBadge: null,
			levelBadge: null,
		};
	}
	const splittedBadge = rawBadge.split('|');
	let modBadge = null;
	let levelBadge = null;
	let isPro = false;
	splittedBadge.forEach((element) => {
		if (element.includes('mod')) {
			modBadge = element;
		}
		if (element === 'pro') {
			isPro = true;
		}
		if ( element === 'bronze'
		|| element === 'silver'
		|| element === 'gold'
		|| element === 'platinum'
		) {
			levelBadge = element;
		}
	});
	return {
		isPro,
		modBadge,
		levelBadge,
	};
};
