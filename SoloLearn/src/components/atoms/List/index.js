import React from 'react';
import { List as Item } from 'material-ui/List';

const List = ({ className, ...props }) =>
	<Item className={`atom_list ${className}`} {...props} />;

List.defaultProps = {
	className: '',
};
export default List;
