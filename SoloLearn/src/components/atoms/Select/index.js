import React from 'react';
import MUISelect from '@material-ui/core/Select';
import './styles.scss';

const Select = ({className, ...props}) => (
	<MUISelect 
		className={`atom_select ${className}`}
		{...props} 
	/>
);

Select.defaultProps = {
	className: '',
};

export default Select;
