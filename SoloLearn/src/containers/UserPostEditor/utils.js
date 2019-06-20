export const getBackgroundStyle = (background, { isPreview }) => {
	switch (background.type) {
	case 'none':
		return {
			background: 'none',
		};
	case 'gradient':
		return {
			// gradients are rendering in other way on mobile
			backgroundImage:
				`linear-gradient(${90 - background.angle}deg, ${background.startColor}, ${background.endColor})`,
			// :
			// `linear-gradient(${background.angle}deg, ${background.endColor}, ${background.startColor})`,
			// backgroundImage: `linear-gradient(${background.angle}deg, ${background.endColor}, ${background.startColor})`,
		};
	case 'image':
		return {
			backgroundImage: `url(${isPreview ? background.previewUrl : background.imageUrl})`,
			backgroundSize: 'cover',
			backgroundRepeat: 'no-repeat',
		};
	case 'color':
		return {
			backgroundColor: background.color,
		};
	default:
		return {};
	}
};

export const getFontSize = (textLength, newLineCount, hasGradient) => {
	if (textLength < 50) {
		 if (newLineCount < 5 && hasGradient) { return 30; }
		return 24;
	} else if (textLength < 200) {
		if (newLineCount < 5) { return 20; }
		return 18;
	} else if (textLength >= 200 && textLength < 350) {
		return 16;
	} else if (textLength >= 350) { return 15; }
};
