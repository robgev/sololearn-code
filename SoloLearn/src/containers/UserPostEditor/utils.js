export const getBackgroundStyle = (background, { isPreview }) => {
	switch (background.type) {
	case 'none':
		return {
			background: 'none',
		};
	case 'gradient':
		return {
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
	switch (newLineCount) {
	case 0:
		if (textLength < 20) {
			return 36;
		}
		if (textLength < 40) {
			return 32;
		}
		return 28;
	case 1:
		return 28;
	case 2:
		return 24;
	case 3:
		return 20;
	case 4:
		return 18;
	default:
		return 16;
	}
};
