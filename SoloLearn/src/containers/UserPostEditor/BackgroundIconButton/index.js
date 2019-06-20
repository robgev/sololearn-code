import React from 'react';
import { Container } from 'components/atoms';
import { getBackgroundStyle } from '../utils';

import './styles.scss';

const BackgroundIconButton = ({ background, onSelect, withBorder }) => {
	const { id } = background;
	const style = getBackgroundStyle(background, { isPreview: true });

	return (
		<Container className={`background-icon-button ${withBorder ? 'with-border' : ''}`} onClick={() => onSelect(id)} style={style} />
	);
};

export default BackgroundIconButton;
