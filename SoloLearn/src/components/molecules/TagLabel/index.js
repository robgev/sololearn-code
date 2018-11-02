import React from 'react';
import { Label } from 'components/atoms';
import './styles.scss';

const TagLabel = ({ tag, className, ...props }) => (
	<Label
		className={`molecule_tag-label ${className}`}
		{...props}
	/>
);

export default TagLabel;
