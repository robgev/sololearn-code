import React from 'react';
import MUISelect from '@material-ui/core/Select';
import './styles.scss';

const Select = React.forwardRef(({ className, ...props }, ref) => (
	<MUISelect
		ref={ref}
		className={`atom_select ${className}`}
		{...props}
	/>
));

Select.defaultProps = {
	className: '',
};

export default Select;
