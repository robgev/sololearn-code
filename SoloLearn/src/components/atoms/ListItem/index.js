import React from 'react';
import { ListItem as Item } from '@material-ui/core/ListItem';

const ListItem = ({ className, ...props }) =>
	<Item classes={{root: `atom_name ${className}`}} {...props} />;

ListItem.defaultProps = {
	className: '',
};
export default ListItem;
