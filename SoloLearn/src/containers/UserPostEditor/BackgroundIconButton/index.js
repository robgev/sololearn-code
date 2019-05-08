import React from 'react';
import { Container } from 'components/atoms';
import { getBackgroundStyle } from '../utils';

import './styles.scss';

const BackgroundIconButton = ({ background, onSelect }) => {
	const { id } = background;
	const style = getBackgroundStyle(background, { isPreview: true });

	console.warn(style);

	return (
		<Container className="background-icon-button" onClick={() => onSelect(id)} style={style} />
	);
};

export default BackgroundIconButton;
