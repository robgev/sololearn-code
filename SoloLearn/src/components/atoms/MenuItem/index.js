import React from 'react';
import Item from '@material-ui/core/MenuItem';
import './styles.scss';

const MenuItem = ({ className, ...props }) =>
	<Item classes={{root: `atom_menu-item ${className}`}} {...props} />;

MenuItem.defaultProps = {
	className: '',
};
export default MenuItem;
