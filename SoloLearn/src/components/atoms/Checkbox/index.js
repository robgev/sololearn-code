import React from 'react';
import Item from 'material-ui/Checkbox';
import './styles.scss';

const Checkbox = ({ className, ...props }) =>
	<Item className={'atom_checkbox ' + className} {...props} />;

Checkbox.defaultProps = {
	className: '',
};
export default Checkbox;