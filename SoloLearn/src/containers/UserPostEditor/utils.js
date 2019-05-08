export const getBackgroundStyle = (background, { isPreview }) => {
	switch (background.type) {
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
