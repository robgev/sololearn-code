import React from 'react';
import MUIList from '@material-ui/core/List';
import './styles.scss';

const List = ({ className, ...props }) => (
	<MUIList className={`atom_list ${className}`} {...props} disablePadding />
);

export default List;
