import React from 'react';
import Item from '@material-ui/core/Tabs';
import './styles.scss';

const Tabs = ({ className, ...props }) =>
	(<Item
		className={`atom_tabs ${className}`}
		classes={{indicator:'atom_tabs-indicator'}}
		fullWidth
		
		{...props}
	/>);

Tabs.defaultProps = {
	className: '',
};
export default Tabs;
