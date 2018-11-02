import React from 'react';
import MUIListItem from '@material-ui/core/ListItem';

import './styles.scss';

const ListItem = ({ className, ...props }) => (
	<MUIListItem className={`atom_list-item ${className}`} {...props} />
);

ListItem.defaultProps = {
	className: '',
};

export default ListItem;
