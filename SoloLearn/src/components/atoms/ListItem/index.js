import React from 'react';
import MUIListItem from '@material-ui/core/ListItem';

import './styles.scss';

const ListItem = ({ className, ...props }) => (
	<MUIListItem
		classes={{
			container: 'atom_list-item-container',
			button: 'atom_list-item-button',
			root: 'atom_list-item',
		}}
		className={className}
		{...props}
	/>
);

ListItem.defaultProps = {
	className: '',
};

export default ListItem;
