import React from 'react';
import Item from 'material-ui/MenuItem';
import './styles.scss';

const MenuItem = ({ className, ...props }) =>
	<Item className={'atom_menu-item ' + className} {...props} />;

MenuItem.defaultProps = {
	className: '',
};
export default MenuItem;