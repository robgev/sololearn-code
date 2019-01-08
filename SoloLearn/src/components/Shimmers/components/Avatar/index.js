import React from 'react';
import BaseItem from '../BasePlaceholder';
import './styles.scss';

const Avatar = ({ big, round }) => (
	<BaseItem className={`shimmer_avatar ${round ? 'round' : ''} ${big ? 'big' : ''}`} />
);

export default Avatar;
