import React from 'react';
import BaseItem from '../BasePlaceholder';
import './styles.scss';

const Tag = ({ className, width }) => (
	<BaseItem style={{ width }} className={`shimmer_tag ${className}`} />
);

export default Tag;
