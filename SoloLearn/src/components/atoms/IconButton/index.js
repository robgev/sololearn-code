import React from 'react';
import MUIIconButton from '@material-ui/core/IconButton';
import './styles.scss';

const IconButton = props => (
	<MUIIconButton classes={{ root: 'atom_icon-button-root' }} {...props} />
);

export default IconButton;
