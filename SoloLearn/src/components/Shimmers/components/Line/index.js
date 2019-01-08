import React from 'react';
import BaseItem from '../BasePlaceholder';
import './styles.scss';

const Line = ({ className, width }) => (
	<BaseItem style={{ width }} className={`shimmer_line ${className}`} />
);

export default Line;
