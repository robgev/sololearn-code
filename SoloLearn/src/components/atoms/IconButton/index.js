import React from 'react';
import MUIIconButton from '@material-ui/core/IconButton';
import './styles.scss';

const IconButton = ({ active, ...props }) => (
	<MUIIconButton classes={{ root: `atom_icon-button-root ${active ? 'active' : ''}` }} {...props} />
);

export default IconButton;
