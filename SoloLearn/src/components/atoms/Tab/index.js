import React from 'react';
import Item from '@material-ui/core/Tab';
import './styles.scss';

const Tab = ({ ...props }) =>
	<Item classes={{root:'atom_tab'}} {...props} />;

export default Tab;
