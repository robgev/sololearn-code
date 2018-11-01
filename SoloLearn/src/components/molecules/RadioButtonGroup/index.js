import React from 'react';
import { RadioButton } from 'components/atoms';
import MUIRadioGroup from '@material-ui/core/RadioGroup';
import './styles.scss';

const RadioButtonGroup = ({
	className, items, children, ...props
}) => (
	<MUIRadioGroup className={`molecule_radio-button-group ${className}`} {...props}>
		{children}
		{ items.map(item => <RadioButton {...item} />) }
	</MUIRadioGroup>
);

RadioButtonGroup.defaultProps = {
	className: '',
	items: [],
};

export default RadioButtonGroup;
