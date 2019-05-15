export const getBackgroundStyle = (background, { isPreview }) => {
	switch (background.type) {
	case 'none':
		return {
			background: 'none',
		};
	case 'gradient':
		return {
			// gradients are rendering in other way on mobile
			// backgroundImage: background.angle === 0 ?
			// `linear-gradient(${background.angle + 90}deg, ${background.startColor}, ${background.endColor})`
			// :
			// `linear-gradient(${background.angle}deg, ${background.endColor}, ${background.startColor})`,
			backgroundImage: `linear-gradient(${background.angle}deg, ${background.endColor}, ${background.startColor})`,
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

export const getFontSize = (textLength, newLineCount) => {
	if (textLength < 50) {
		if (newLineCount < 5) { return 36; }
		return 26;
	} else if (textLength < 200) {
		if (newLineCount < 5) { return 22; }
		return 20;
	} else if (textLength >= 200 && textLength < 350) {
		if (newLineCount < 5) { return 18; }
		return 16;
	} else if (textLength >= 350) { return 14; }
};
