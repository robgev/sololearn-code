import React from 'react';
import MUIIconButton from '@material-ui/core/IconButton';
import './styles.scss';

const IconButton = ({ active, className, ...props }) => (
	<MUIIconButton classes={{ root: `atom_icon-button-root ${className} ${active ? 'active' : ''}` }} {...props} />
);

export default IconButton;
