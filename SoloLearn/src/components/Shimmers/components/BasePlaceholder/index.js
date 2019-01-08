import React from 'react';
import { Container } from 'components/atoms';
import './styles.scss';

const BasePlaceholder = ({ style, className }) => (
	<Container style={style} className={`shimmer_placeholder ${className}`} />
);

export default BasePlaceholder;
