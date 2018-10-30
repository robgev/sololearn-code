import React from 'react';
import { ListItem as Item } from 'material-ui/List';

const ListItem = ({ className, ...props }) =>
	<Item className={'atom_name ' + className} {...props} />;

ListItem.defaultProps = {
	className: '',
};
export default ListItem;